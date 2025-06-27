import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { Course, CourseEvent, CoursePrice } from './CoursePresentation';

interface Message {
  role: 'user' | 'assistant' | 'tool';
  content: string;
}

interface CurrentUser {
  username: string | null
  sessionid: string | null
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Chunk {
  type: 'assistant_message' | 'tool_call_request' | 'tool_call_result' | 'tool_call_init';
  payload: any;
}

export class ApiClient {
  // API endpoint adress
  private readonly ApiUrl = 'http://localhost:8000';
  private axiosInstance: AxiosInstance;

  // refreshing assists
  private isRefreshing = false;
  private refreshQueue: ((token: string) => void)[] = [];

  // token
  private accessToken: string | null = null;

  constructor() {
    // create an axios instance for reuse
    this.axiosInstance = axios.create({withCredentials: true});

    // REQUEST interceptor: ensure we’re authenticated & attach the token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // skip if try to authenticate
        if (config.url === `${this.ApiUrl}/auth/token`) {return config}

        // If we don't yet have a token, authenticate
        if (!this.accessToken) {
          await this.authenticate("Standard", "password"); // your method to log in / get accessToken
        }
        // Inject the access token
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${this.accessToken}`;
        return config;
      },
    );

    // Response interceptor to catch 401s
    this.axiosInstance.interceptors.response.use(
      res => res,
      async (error: AxiosError) => {
        const originalReq = error.config as AxiosRequestConfig & { _retry?: boolean };
        // Only handle 401 once per request
        if (error.response?.status === 401 && !originalReq._retry) {
          originalReq._retry = true;

          // If a refresh is already in-flight, queue up this retry
          if (this.isRefreshing) {
            return new Promise(resolve => {
              this.refreshQueue.push((token: string) => {
                originalReq.headers!['Authorization'] = `Bearer ${token}`;
                resolve(this.axiosInstance(originalReq));
              });
            });
          }

          this.isRefreshing = true;
          try {
            // Call your refresh endpoint
            await this.refresh();

            // Drain queue: replay all the stalled requests
            this.refreshQueue.forEach(cb => cb(this.accessToken!));
            this.refreshQueue = [];

            // Retry the original request
            originalReq.headers!['Authorization'] = `Bearer ${this.accessToken}`;
            return this.axiosInstance(originalReq);
          } catch (refreshError) {
            // Refresh failed (e.g. refresh token expired) → force logout
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // authenticate to get access token
  async authenticate(username: string, password: string): Promise<void> {
    // create parameter list only used username and password
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    params.append('scope', '');
    params.append('client_id', '');
    params.append('client_secret', '');

    // make post request
    try{
      const response = await this.axiosInstance.post<TokenResponse>(
        `${this.ApiUrl}/auth/token`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          timeout: 2000
        }
      );

      // store token
      this.accessToken = response.data.access_token;
    } catch {
      console.log("failed to authenticate use, an error accured!")
    }
  }

  // refresh
  async refresh(): Promise<void> {
    // call the refresh endpoint; axios will automatically send the cookie
    const response = await this.axiosInstance.post<TokenResponse>(`${this.ApiUrl}/auth/refresh`);
    this.accessToken = response.data.access_token;
  }

  // function to get current user
  async getcurrentUser(): Promise<CurrentUser> {
    try{
      const response = await this.axiosInstance.get<CurrentUser>(
        `${this.ApiUrl}/auth/users/me/`,
        {
            headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
            },
            timeout: 2000
        }
      );
      return response.data
    } catch {
      return {username: null, sessionid: null}
    }
  }

  // query the API endpoints MCP-Client and request a non streaming answer
  async query_non_streaming(q: string): Promise<Message[]>{
    // post request
    const response = await this.axiosInstance.post<Message[]>(
        `${this.ApiUrl}/query/non_streaming`,
        { query: q },
        {
            headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
            },
        }
    );

    // return MCP-Client responses
    return response.data;
  }

  // query the API endpoints MCP-CLient and request streaming answer
  async query_streaming(query: string, onChunk: (chunk: Chunk) => void, noQuery: boolean = false): Promise<void>{
    // fetch the API endpoint
    const res = await fetch(
      `${this.ApiUrl}/query/streaming`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.accessToken}` },
        body: JSON.stringify({ query: query, no_query:noQuery }),
      }
    );

    if (!res.body) {
      throw new Error('No response body');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      // read a value
      const { value, done } = await reader.read();
      if (done) break;

      // accumulate text (ndjson)
      buffer += decoder.decode(value, { stream: true });
      // split on newline (ndjson)
      const parts = buffer.split('\n');
      buffer = parts.pop()!; // leftover for next chunk
      
      
      for (const line of parts) {
        if (!line.trim()) continue;
        // process chunks
        let chunk: Chunk;
        try {
          chunk = JSON.parse(line);
        } catch (err) {
          console.warn('Could not parse chunk:', line);
          continue;
        }
        onChunk(chunk);
      }
    }

    // flush any remaining buffer (if the server didn't end with a newline)
    if (buffer.trim()) {
      try {
        onChunk(JSON.parse(buffer));
      } catch { /* ignore */ }
    }
  }

  async updateToolResult(toolCallId: string, newResult: string): Promise<boolean> {
    try{
      // request to delete message
      const res = await fetch(
        `${this.ApiUrl}/query/update_tool_result`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.accessToken}` },
          body: JSON.stringify({ tool_call_id: toolCallId, new_tool_call_result: newResult }),
        }
      );

      // evaluate response
      const raw = await res.json();

      console.log(res)

      const status_code = (typeof raw === 'object') ? raw.status_code : 400
      return status_code === 200 ? true : false;
    } catch (err) {
      return false
    }
  }

  async getCourseInfo(code: string, summary: string | null = null): Promise<Course>{
    // fet course data
    const res = await fetch(`${this.ApiUrl}/resources/course_data?code=${code}`)
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    const text = await res.json();
    const raw  = JSON.parse(text);

    return {
      code:raw.code,
      title:raw.title,
      description:raw.descr,
      summary:summary,
      date:raw.date,
      weekdays:raw.weekdays,
      placesLeft:raw.placesleft,
      places:raw.places,
      events: {
        eventCount: raw.events?.total_event_count ?? 0,
        eventTimes: Array.isArray(raw.events?.event_times)
          ? raw.events.event_times.map((et: any) => ({
              count: et.count,
              time:  et.time,
            }))
          : []
      },
      prices:
        Array.isArray(raw.prices)
        ? raw.prices.map((p: any) => ({
            name: p.name,
            price: p.price,
            currency: p.currency,
          }))
        : [],
      categories:raw.categories
    }
  }
  
  async clearMessageHistory(): Promise<boolean> {
    try{
      // request to clear history
      const res = await fetch(
        `${this.ApiUrl}/query/messages/clear`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.accessToken}` },
        }
      );

      // evaluate response
      const raw = await res.json();
      const status_code = (typeof raw === 'object') ? raw.status_code : 400
      return status_code === 200 ? true : false;
    } catch (err) {
      return false
    }
  }

  async deleteMessage(index: number): Promise<boolean> {
    try{
      // request to delete message
      const res = await fetch(
        `${this.ApiUrl}/query/messages/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.accessToken}` },
          body: JSON.stringify({ index }),
        }
      );

      // evaluate response
      const raw = await res.json();
      const status_code = (typeof raw === 'object') ? raw.status_code : 400
      return status_code === 200 ? true : false;
    } catch (err) {
      return false
    }
  }
}

// Singleton holder
let _instance: ApiClient | null = null;
export function getApiClient(): ApiClient {
  if (!_instance) {
    _instance = new ApiClient();
  }
  return _instance;
}