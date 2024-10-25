from difflib import SequenceMatcher
import response_db as response_db

def find_answer(user_question, context):
    """
    Find the most similar question from the predefined list based on the user's input and context.
    Uses fuzzy matching to compare the user's question with the stored questions in the relevant context
    and returns the best matching answer.
    """
    
    highest_ratio = 0 
    return_answer = ''

    # Try to match the user's question to the best possible answer from the specified context list
    try:
        # Check which context (General, Onboarding, or Pricing) is being used
        if context == 'general':
            # Loop through the 'General' questions and calculate similarity between user question and each stored question
            for item in response_db.general_questions:
                current_ratio = get_similarity_ratio(user_question, item['question'])
                # Update the highest ratio and corresponding answer if a better match is found
                if current_ratio > highest_ratio:
                    return_answer = item['answer']
                    highest_ratio = current_ratio                              

        elif context == 'onboarding':
            # Same process for the 'Onboarding' questions
            for item in response_db.onboarding_questions:
                current_ratio = get_similarity_ratio(user_question, item['question'])
                if current_ratio > highest_ratio:
                    return_answer = item['answer']
                    highest_ratio = current_ratio                

        elif context == 'pricing':
            # Same process for the 'Pricing' questions
            for item in response_db.pricing_questions:
                current_ratio = get_similarity_ratio(user_question, item['question'])
                if current_ratio > highest_ratio:
                    return_answer = item['answer']
                    highest_ratio = current_ratio            

        # If a match with a similarity ratio greater than the ratio specified is found, return the corresponding answer
        if highest_ratio > 0.6:            
            return return_answer
        else:
            # If no good match is found, return a default response asking the user to rephrase
            return "I'm not sure about that, can you rephrase?"

    # Catch any exceptions that may occur during processing
    except Exception as e:        
        return "An error occurred. Please try again later."

# Utility function to calculate similarity ratio between user input question and stored questions
def get_similarity_ratio(user_question, db_question):
    return SequenceMatcher(None, user_question, db_question).ratio()
