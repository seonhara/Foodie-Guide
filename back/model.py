import openai
import os
from dotenv import load_dotenv
load_dotenv()

openai_api_key = os.environ.get('OPENAI_API_KEY')

def get_recommendations(user_message):
    client = openai.OpenAI(api_key=openai_api_key) 
    print("user_message", user_message)

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_message}]
        )
        bot_reply = response.choices[0].message.content
        
    except Exception as e:
        bot_reply = f"오류 발생: {str(e)}"

    return {"reply": bot_reply}