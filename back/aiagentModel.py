import openai
import os
from dotenv import load_dotenv
load_dotenv() 

# OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=OPENAI_API_KEY) 

CHAT_NORMAL = "일반 대화"
CHAT_ASKMORE = "음식점 메뉴 추천 없이 일반 질문"
CHAT_MENURCMD = "음식점 메뉴 추천"
CHAT_MENURCMD_MYCOND = "본인 상태 알림 및 관련 음식점 메뉴 추천"
CHAT_MENURCMD_MYTASTE = "먹고 싶은 음식점 메뉴 설명 및 추천"
CHAT_MENURCMD_RESTAURANT = "식당 추천 요청 또는 특정 메뉴 언급"

CHAT_TYPES = [CHAT_NORMAL, CHAT_ASKMORE, CHAT_MENURCMD, CHAT_MENURCMD_MYCOND, CHAT_MENURCMD_MYTASTE, CHAT_MENURCMD_RESTAURANT]


def classify_request(user_input):
    string_types = "".join([f"- {item}\n" for item in CHAT_TYPES])
    prompt = f"""
    다음 문장이 어떤 유형인지 분류해줘. 가능한 카테고리는 다음과 같아:
    {string_types}
    
    문장: "{user_input}"
    
    답변 형식은 반드시 다음과 같이 해줘:
    
    분류: 카테고리명
    
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": "너는 입력된 문장을 카테고리로 분류하는 AI야."},
                  {"role": "user", "content": prompt}],
        temperature=0  # 일관된 응답을 위해 0으로 설정
    )

    # 응답에서 카테고리 추출
    result_text = response.choices[0].message.content
    category = result_text.split("분류: ")[-1].strip()
    print(category)
    
    return category

def extract_and_search_menu(text):
    prompt = f"""
    다음 문장을 읽고 문장에서 추천하거나 먹기 좋은 메뉴를 추출해줘:
    
    문장: "{text}"
    
    답변 형식은 반드시 다음과 같이 해줘:
    
    답변: 메뉴1,메뉴2,메뉴3,메뉴4,메뉴5,...
    
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": "너는 입력된 문장에서 추천하는 메뉴나 먹기 좋은 메뉴를 추출하는 AI야."},
                  {"role": "user", "content": prompt}],
        temperature=0  # 일관된 응답을 위해 0으로 설정
    )

    # 응답에서 카테고리 추출
    result_text = response.choices[0].message.content
    menus = result_text.split(",")
        
    return menus

def chat(user_message):
    messages = []
    messages.append({"role": "user", "content": user_message})
    category = classify_request(user_message)
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        bot_reply = response.choices[0].message.content
    except Exception as e:
        bot_reply = f"오류 발생: {str(e)}"

    print("🚨🚨🚨🚨 bot_reply", bot_reply)

    link_exist = False
    if category in [CHAT_MENURCMD, CHAT_MENURCMD_MYTASTE, CHAT_MENURCMD_MYCOND, CHAT_MENURCMD_RESTAURANT]:
        menus = extract_and_search_menu(bot_reply)
        link_exist = True
    else:
        menus = []
        link_exist = False
    print(menus)
    if len(menus) > 0:
        add_str = "[{}]".format(",".join(menus))
    
    return {"reply": bot_reply, "menus": ",".join(menus), "link_exist": link_exist, "category": category}