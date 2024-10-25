from utils import find_answer

# Test function using pytest
def test_find_answer():
    # Test progressivly worse questions
    # "What is Artisan?"
    assert find_answer("What is Artisan?", "general") == "Artisan is an AI-first platform designed to automate outbound sales, providing AI-driven tools to optimize sales workflows."
    # "How does Ava find leads during onboarding?"
    assert find_answer("how doe av find lads during oboading", "onboarding") == "Ava leverages a B2B database of 300M+ contacts and uses your provided criteria to identify leads."
    # "Are discounts available for long-term contracts?"
    assert find_answer("discont long tem contrac?", "pricing") == "Yes, Artisan offers discounts for long-term commitments, which can be discussed with the sales team."
    # Test no match is found condition
    assert find_answer("Ava outreac", "general") == "I'm not sure about that, can you rephrase?"