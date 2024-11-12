from utils import find_answer

# Test function using pytest
def test_find_answer():
    # Test progressivly worse questions
    # "What is Eko?"
    assert find_answer("What is Eko?", "general") == "Eko is a customer support chatbot that helps businesses automate responses to common customer inquiries using fuzzy logic."
    # "What is the setup process for Eko?"
    assert find_answer("wha is th stup proce for ek", "onboarding") == "The setup involves integrating Eko into your platform and customizing your knowledge base with your own Q&A pairs."
    # "Can I change my plan later?"
    assert find_answer("ca chnge pla latr", "pricing") == "Yes, you can upgrade or downgrade your plan at any time to match your business needs."
    # Test no match is found condition - "Can I personalize the responses in Eko?"
    assert find_answer("cn pers re n ek", "general") == "I'm not sure about that, can you rephrase?"