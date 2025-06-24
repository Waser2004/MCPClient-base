import React, { createContext, useContext } from "react";
import { getApiClient, ApiClient } from "./Api";

const ApiContext = createContext<ApiClient>(getApiClient());

export const ApiProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <ApiContext.Provider value={getApiClient()}>
      {children}
    </ApiContext.Provider>
  );
};

export function useApi(): ApiClient {
  return useContext(ApiContext);
}