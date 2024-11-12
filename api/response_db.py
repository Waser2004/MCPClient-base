greetings = [
    # Greetings and general inquiries
    {"question": "Hi", "answer": "Hello! How can I assist you with Eko today?"},
    {"question": "hi", "answer": "Hello! How can I assist you with Eko today?"},
    {"question": "Hey", "answer": "Hi there! How can I help you regarding Eko?"},
    {"question": "Hello!", "answer": "Hello! What can I do for you today concerning Eko?"},
    {"question": "Hi there!", "answer": "Greetings! How may I assist you with Eko?"},
    {"question": "Good morning!", "answer": "Good morning! How can I help you with Eko today?"},
    {"question": "Good afternoon!", "answer": "Good afternoon! What can I assist you with regarding Eko?"},
    {"question": "Good evening!", "answer": "Good evening! How may I help you concerning Eko?"},
    {"question": "Hey, how are you?", "answer": "I'm doing great, thank you! How can I assist you with Eko today?"},
    {"question": "How's it going?", "answer": "All is well, thank you! How can I help you with Eko?"},
    {"question": "What's up?", "answer": "I'm here to help you with any questions about Eko. How can I assist you?"},
    {"question": "How are you today?", "answer": "I'm doing well, thank you! What can I do for you regarding Eko?"},
    {"question": "Greetings!", "answer": "Greetings! How can I assist you with Eko today?"},
]

general_questions = [
    # Basic Information
    {"question": "What is Eko?", "answer": "Eko is a customer support chatbot that helps businesses automate responses to common customer inquiries using fuzzy logic."},
    {"question": "How does Eko work?", "answer": "Eko uses fuzzy logic and a predefined knowledge base to match user questions with the most relevant answers."},
    {"question": "What makes Eko different from other chatbots?", "answer": "Unlike traditional AI-driven chatbots, Eko doesn't rely on expensive AI models. It uses fuzzy logic for efficient and cost-effective customer support."},
    {"question": "Can you tell me about Eko?", "answer": "Certainly! Eko is a customer support chatbot that automates responses to common inquiries using fuzzy logic."},
    {"question": "What does Eko do?", "answer": "Eko automates customer support by providing instant answers to frequently asked questions from a customizable knowledge base."},
    # Key Features and Benefits
    {"question": "Can Eko handle multiple customer queries simultaneously?", "answer": "Yes, Eko is designed to handle multiple customer interactions at the same time, providing instant responses."},
    {"question": "Is Eko suitable for small businesses?", "answer": "Absolutely! Eko is scalable and suitable for businesses of all sizes, from small startups to large enterprises."},
    {"question": "How does Eko improve customer service?", "answer": "By providing instant answers to common questions, Eko enhances customer satisfaction and frees up support staff for more complex issues."},
    {"question": "What platforms does Eko support?", "answer": "Eko can be integrated into websites and applications, enhancing customer support across various platforms."},
    {"question": "How does Eko handle user queries?", "answer": "Eko uses fuzzy logic to match user queries with the most relevant responses in its knowledge base, even if the wording isn't exact."},
    {"question": "How does Eko improve customer satisfaction?", "answer": "By providing instant and accurate answers to common questions, Eko enhances the customer experience."},    
    # Fuzzy Logic Technology
    {"question": "What is fuzzy logic in the context of Eko?", "answer": "Fuzzy logic allows Eko to understand and match user queries with relevant answers, even if the phrasing isn't exact."},
    {"question": "What technology does Eko use?", "answer": "Eko leverages fuzzy logic and a predefined knowledge base, without relying on AI or machine learning models."},
    {"question": "Can you explain what fuzzy logic is?", "answer": "Fuzzy logic is a method of processing information that allows Eko to interpret and match user questions with relevant answers, even if the wording isn't exact. This makes Eko more adaptable in understanding various ways customers might phrase their inquiries."},
    # Customization Options
    {"question": "How customizable is Eko?", "answer": "Eko allows businesses to easily add, edit, or remove questions and answers in the knowledge base without technical expertise."},
    {"question": "Does Eko require any coding skills to customize?", "answer": "No, Eko is user-friendly and doesn't require any coding skills for customization."},
    {"question": "Can Eko be customized for my business?", "answer": "Absolutely! You can tailor Eko's knowledge base to include questions and answers specific to your business."},
    {"question": "Can I personalize the responses in Eko?", "answer": "Yes, you can customize the responses to align with your brand's voice and tone."},
    {"question": "Does Eko support multimedia responses?", "answer": "Currently, Eko supports text-based responses. Support for multimedia responses is planned for future releases."},
    # Cost and Efficiency
    {"question": "How can Eko benefit my business?", "answer": "Eko can reduce support costs, improve response times, and enhance customer satisfaction by automating common inquiries."},
    {"question": "Is Eko cost-effective?", "answer": "Yes, Eko is designed to reduce operational costs by eliminating the need for expensive AI model integrations."},
    # Integration and Language Support
    {"question": "Is Eko easy to integrate?", "answer": "Yes, Eko is built with React and FastAPI, making it easy to integrate into your existing website or application."},
    {"question": "Does Eko support multiple languages?", "answer": "Currently, Eko supports English, but additional language support is planned for future updates."},
    # Knowledge Base and Updates
    {"question": "How does Eko handle updates to the knowledge base?", "answer": "Businesses can easily add, edit, or delete Q&A pairs in the knowledge base through a user-friendly interface."},
    {"question": "What kind of customer questions can Eko handle?", "answer": "Eko is best suited for handling common and frequently asked questions that can be addressed with predefined answers."},
    {"question": "Tell me more about your chatbot.", "answer": "Eko is a customer support chatbot that uses fuzzy logic to automate responses to common inquiries, enhancing efficiency."},
    {"question": "What services does Eko offer?", "answer": "Eko offers automated customer support by instantly answering frequently asked questions through a customizable knowledge base."},
    # Analytics and User Feedback
    {"question": "Does Eko provide analytics on customer interactions?", "answer": "Eko offers basic analytics on customer interactions to help you understand common inquiries and improve your knowledge base."},
    # Limitations and Support
    {"question": "What are the limitations of Eko?", "answer": "Eko may not handle highly complex or nuanced inquiries that require advanced natural language understanding."},
    {"question": "Is technical expertise required to manage Eko?", "answer": "No, Eko is designed to be user-friendly, allowing non-technical users to manage the knowledge base with ease."},
    {"question": "How do I get support for Eko?", "answer": "You can contact our support team via email at support@eko.com for any assistance you need."},
] + greetings

onboarding_questions = [
    # Getting Started
    {"question": "How do I get started with Eko?", "answer": "After signing up, you'll be guided through the setup process to integrate Eko with your website or application."},
    {"question": "What's the first step to use Eko?", "answer": "First, sign up for an account, then you'll be guided through integrating Eko and customizing your knowledge base."},
    {"question": "How do I integrate Eko into my website?", "answer": "You can integrate Eko by copying and pasting a snippet of code into your website's HTML, following our step-by-step guide."},
    {"question": "How can I install Eko on my app?", "answer": "You can integrate Eko into your app by using our provided API endpoints and following the integration guide."},
    {"question": "I just signed up for Eko. What's next?", "answer": "Great! Next, you'll integrate Eko into your platform and begin customizing your knowledge base."},
    # Setup and Configuration
    {"question": "What is the setup process for Eko?", "answer": "The setup involves integrating Eko into your platform and customizing your knowledge base with your own Q&A pairs."},
    {"question": "Do I need technical skills to set up Eko?", "answer": "No, Eko is designed for easy setup without requiring any technical expertise."},
    {"question": "Is there documentation to help me set up Eko?", "answer": "Yes, we provide comprehensive documentation and tutorials to assist you with the setup process."},
    {"question": "Can I customize the look and feel of Eko?", "answer": "Yes, you can adjust Eko's interface to match your brand's colors and style guidelines."},
    {"question": "How long does it take to set up Eko?", "answer": "The setup process is quick and can be completed in under 30 minutes, depending on your customization needs."},
    # Knowledge Base Management
    {"question": "How do I add questions and answers to Eko?", "answer": "You can add, edit, or delete Q&A pairs through Eko's user-friendly dashboard."},
    {"question": "Is there a limit to the number of Q&A pairs I can add?", "answer": "No, you can add as many Q&A pairs as you need to fully customize Eko for your business."},
    {"question": "Can I import an existing FAQ into Eko?", "answer": "Yes, you can import your existing FAQ content into Eko's knowledge base using our import tool."},
    {"question": "How do I customize Eko's responses?", "answer": "You can edit the responses directly in the knowledge base, allowing you to tailor them to your brand's voice."},
    {"question": "Can I set up different knowledge bases for different products?", "answer": "Yes, Eko allows you to create multiple knowledge bases to cater to different products or services."},
    {"question": "How do I edit or delete a Q&A pair?", "answer": "You can manage your Q&A pairs through the dashboard by selecting the pair you wish to edit or delete."},
    # Testing and Previewing
    {"question": "Can I test Eko before deploying it?", "answer": "Yes, you can test Eko in a sandbox environment to ensure it meets your needs before going live."},
    {"question": "How do I know if Eko is properly integrated?", "answer": "You can test Eko's functionality on your platform, and our support team can help verify the integration if needed."},
    {"question": "Can I preview Eko's responses?", "answer": "Yes, you can preview how Eko responds to queries directly from the dashboard."},
    # Support and Resources
    {"question": "Do you offer onboarding support?", "answer": "Yes, our support team is available to assist you throughout the onboarding process."},
    {"question": "What if I need help during setup?", "answer": "Our support team is ready to assist you via email or live chat to ensure a smooth setup process."},
    {"question": "Are there any tutorials available for onboarding?", "answer": "Yes, we offer video tutorials and step-by-step guides to help you get started with Eko."},
    {"question": "Can someone guide me through Eko's setup?", "answer": "Absolutely! Our support team is available to guide you through the setup process step by step."},
    {"question": "Is there an onboarding guide for Eko?", "answer": "Yes, we provide an onboarding guide that covers all the steps to get Eko up and running."},
    # Advanced Customization and Roles
    {"question": "How do I train Eko to understand new questions?", "answer": "Simply add new Q&A pairs to the knowledge base, and Eko will use fuzzy logic to match relevant queries."},
    {"question": "Does Eko support integration with CRM systems?", "answer": "Currently, Eko focuses on customer support interactions. CRM integration is planned for future updates."},
    {"question": "Can I assign different permissions to team members?", "answer": "Yes, you can manage user roles and permissions within Eko to control access for different team members."}
] + greetings

pricing_questions = [
    # Pricing Structure
    {"question": "How is Eko priced?", "answer": "Eko offers a tiered pricing model based on the number of monthly interactions, suitable for businesses of all sizes."},
    {"question": "How much does Eko cost?", "answer": "Eko offers a tiered pricing model based on the number of monthly interactions, suitable for businesses of all sizes."},
    {"question": "What are your pricing plans?", "answer": "We offer Basic, Standard, and Premium plans, each designed to suit different levels of usage and business sizes."},
    {"question": "Do you charge per interaction or per user?", "answer": "Our pricing is based on the number of customer interactions per month, not per user."},
    {"question": "Are there enterprise pricing options?", "answer": "Yes, we offer enterprise solutions with customized pricing. Please contact our sales team to discuss your needs."},
    {"question": "How does Eko's pricing compare to other chatbots?", "answer": "Eko is cost-effective because it doesn't rely on expensive AI models, offering competitive pricing for quality support."},
    # Free Trial and Discounts
    {"question": "Do you offer a free trial of Eko?", "answer": "Yes, we offer a 14-day free trial so you can experience Eko's features before committing to a plan."},
    {"question": "How does the free trial work?", "answer": "The free trial gives you full access to Eko's features for 14 days, with no credit card required to start."},
    {"question": "Is there a nonprofit discount?", "answer": "Yes, we offer a 15% discount for registered nonprofit organizations. Please contact us to apply."},
    {"question": "Do you offer discounts for annual subscriptions?", "answer": "Yes, we offer a 10% discount when you choose an annual subscription plan."},
    # Payment and Billing
    {"question": "What payment methods do you accept?", "answer": "We accept major credit cards and can arrange for invoicing on annual plans."},
    {"question": "Are there any long-term contracts?", "answer": "No long-term contracts are required. You can choose monthly billing and cancel anytime."},
    {"question": "What currency are your prices in?", "answer": "All our prices are listed in US dollars (USD)."},
    # Plan Changes and Adjustments
    {"question": "Can I change my plan later?", "answer": "Yes, you can upgrade or downgrade your plan at any time to match your business needs."},
    {"question": "What happens if I exceed my interaction limit?", "answer": "If you exceed your plan's limit, you can either upgrade to a higher plan or pay for additional interactions as needed."},
    {"question": "Can I pause my subscription?", "answer": "Yes, you can pause your subscription for up to three months if needed."},
    {"question": "Do you offer refunds?", "answer": "We offer a prorated refund if you cancel your annual subscription within the first 30 days."},
    # Inclusions and Guarantees
    {"question": "Is customer support included in the price?", "answer": "Yes, all plans include access to our customer support team at no additional cost."},
    {"question": "Are there any additional charges for updates?", "answer": "No, all updates and new features are included in your subscription at no extra cost."},
    {"question": "Is training included in the price?", "answer": "Yes, onboarding assistance and access to tutorials are included in all our pricing plans."},
    {"question": "Do you offer any guarantees?", "answer": "We offer a satisfaction guarantee during your first 30 days. If you're not satisfied, you can cancel for a prorated refund."},
    {"question": "Are there any hidden fees with Eko?", "answer": "No, our pricing is transparent with no hidden fees. The subscription covers all features outlined in your plan."},    
    # Custom and Enterprise Plans
    {"question": "Can I get a custom plan for Eko?", "answer": "Yes, for businesses with specific needs, we can create a custom plan. Please contact our sales team to discuss."},
    {"question": "Is there a limit to the number of users on my account?", "answer": "All plans allow unlimited team members, so you can collaborate without additional costs."},
    # Subscription and Sign-up
    {"question": "How can I subscribe to Eko?", "answer": "You can subscribe by signing up on our website and choosing the plan that best fits your needs."},
    {"question": "Is there a setup fee for Eko?", "answer": "No, there are no setup fees. You only pay the subscription cost for your chosen plan."},
    # Additional Pricing Inquiries
    {"question": "I'm interested in Eko's cost.", "answer": "Great! Eko offers various plans to suit different needs. How can I assist you with pricing information?"},
    {"question": "Can I get a demo before purchasing?", "answer": "Yes, we offer live demos. Please contact us to schedule a session at your convenience."}
] + greetings
