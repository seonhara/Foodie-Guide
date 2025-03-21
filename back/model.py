import json
from pathlib import Path
from pprint import pprint
from langchain_text_splitters import RecursiveJsonSplitter
import json
import os
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser
from operator import itemgetter
from langchain_openai import ChatOpenAI
import openai
from dotenv import load_dotenv

from langchain.schema.runnable import RunnableLambda, RunnableSequence, RunnableParallel
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage

load_dotenv()

openai_api_key = os.environ.get('OPENAI_API_KEY')
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

CHAT_NORMAL = "일반 대화"
CHAT_MENURCMD = "메뉴 추천"
CHAT_MENURCMD_MYCOND = "본인 상태 알림 및 관련 메뉴 추천"
CHAT_MENURCMD_MYTASTE = "먹고 싶은 메뉴 설명 및 추천"

CHAT_TYPES = [CHAT_NORMAL, CHAT_MENURCMD, CHAT_MENURCMD_MYCOND, CHAT_MENURCMD_MYTASTE]


# 카테고리 분류 chain
def classify_input(user_input):
    string_types = "".join([f"- {item}\n" for item in CHAT_TYPES])
    return {"string_types": string_types, "user_input": user_input}
    
def classify_prompt(data):
    user_prompt = f"""
      다음 문장이 어떤 유형인지 분류해줘. 가능한 카테고리는 다음과 같아:
      {data['string_types']}
      
      문장: "{data['user_input']}"
      
      답변 형식은 반드시 다음과 같이 해줘:
      
      분류: [카테고리명]
    """
    system_msg = SystemMessage(content="너는 입력된 문장을 카테고리로 분류하는 AI야.")
    user_msg = HumanMessage(content=user_prompt)
    return [system_msg, user_msg]

def classify_output(response):
    result_text = response.content
    category = result_text.split("분류: ")[-1].strip()
    return category

classify_input_chain = RunnableLambda(classify_input)
classify_message_chain = RunnableLambda(classify_prompt)
classify_output_chain = RunnableLambda(classify_output)

classify_chain = RunnableSequence(
    classify_input_chain 
    | classify_message_chain 
    | llm 
    | classify_output_chain
)

# bot 응답 chain
def get_bot_reply_input(user_input):
    return [{"role": "user", "content": user_input[0]['user_input']}]

def get_bot_reply_output(response):
    return response.content
    
get_bot_reply_input_chain = RunnableLambda(get_bot_reply_input)
get_bot_reply_output_chain = RunnableLambda(get_bot_reply_output)

get_bot_reply_chain = RunnableSequence(
    get_bot_reply_input_chain
    | llm
    | get_bot_reply_output_chain
)

# 카테고리 분류 + bot 응답 chain : 병렬처리
category_and_bot_reply_chain = RunnableParallel(
    category=classify_chain,
    reply=get_bot_reply_chain
)

# 메뉴 추천 chain
def get_menu_message(text):
    user_prompt = f"""
    다음 문장을 읽고 문장에서 추천하거나 먹기 좋은 메뉴를 추출해줘:
    
    문장: "{text}"
    
    답변 형식은 반드시 다음과 같이 해줘:
    
    메뉴1,메뉴2,메뉴3,메뉴4,메뉴5,...
    
    """
    system_msg = SystemMessage(content="너는 입력된 문장에서 추천하는 메뉴나 먹기 좋은 메뉴를 추출하는 AI야.")
    user_msg = HumanMessage(content=user_prompt)
    return [system_msg, user_msg]

def get_menu_output(response):
    return response.content.split(",")

get_menu_message_chain = RunnableLambda(get_menu_message)
get_menu_output_chain = RunnableLambda(get_menu_output)

get_menu_chain = RunnableSequence(
    get_menu_message_chain 
    | llm 
    | get_menu_output_chain
)

def chat(user_message):
    output = category_and_bot_reply_chain.invoke([{"user_input": user_message}])

    link_exist = False
    if output['category'] in [CHAT_MENURCMD, CHAT_MENURCMD_MYTASTE, CHAT_MENURCMD_MYCOND]:
        menus = get_menu_chain.invoke([{"user_input": output['reply']}])
        link_exist = True
    else:
        menus = []
        link_exist = False
    print(menus)
    if len(menus) > 0:
        add_str = "[{}]".format(",".join(menus))
    
    return {"reply": output['reply'], "menus": ",".join(menus), "link_exist": link_exist, "category": output['category']}
