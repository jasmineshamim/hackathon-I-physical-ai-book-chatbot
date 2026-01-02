import openai
from app.config.settings import settings

# Configure OpenAI to use OpenRouter
openai.api_key = settings.openrouter_api_key
openai.base_url = settings.openrouter_base_url
model = settings.openrouter_model_name

print(f"Using model: {model}")
print(f"Using base_url: {openai.base_url}")

try:
    # Simple test query
    response = openai.chat.completions.create(
        model=model,
        messages=[
            {"role": "user", "content": "Hello, how are you?"}
        ],
        temperature=0.7,
        max_tokens=100,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    
    print(f"Response type: {type(response)}")
    print(f"Response: {response}")
    
    # Try to access the content
    content = response.choices[0].message.content
    print(f"Content: {content}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()