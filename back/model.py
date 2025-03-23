from flask import session
import os
import uuid
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain.schema import HumanMessage, SystemMessage
from langchain.schema.runnable import RunnableLambda, RunnableSequence, RunnableParallel
from langchain_community.chat_message_histories import ChatMessageHistory

load_dotenv()
openai_api_key = os.environ.get('OPENAI_API_KEY')

# 벡터 데이터
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
persist_db = Chroma(
    persist_directory="./chromadb",
    embedding_function=embeddings,
    # collection_name="health_chroma_test",
)
persist_db.get()

retriever = persist_db.as_retriever(
    search_type="mmr", search_kwargs={"k": 6, "lambda_mult": 0.25, "fetch_k": 10}
)
 
# 대화 category 설정 
CHAT_NORMAL = "일반 대화"
CHAT_ASKMORE = "음식점 메뉴 추천 없이 일반 질문"
CHAT_MENURCMD = "음식점 메뉴 추천"
CHAT_MENURCMD_MYCOND = "본인 상태 알림 및 관련 음식점 메뉴 추천"
CHAT_MENURCMD_MYTASTE = "먹고 싶은 음식점 메뉴 설명 및 추천"

CHAT_TYPES = [CHAT_NORMAL, CHAT_ASKMORE, CHAT_MENURCMD, CHAT_MENURCMD_MYCOND, CHAT_MENURCMD_MYTASTE]

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

session_store = {}
def get_session_history(session_ids: str) -> BaseChatMessageHistory:
    if session_ids not in session_store:
        # 새로운 ChatMessageHistory 객체를 생성하여 session_store에 저장
        session_store[session_ids] = ChatMessageHistory()
    return session_store[session_ids]  # 해당 세션 ID에 대한 세션 기록 반환

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
      
      분류: 카테고리명
    """
    system_message = SystemMessage(content="너는 입력된 문장을 카테고리로 분류하는 AI야.")
    user_message = HumanMessage(content=user_prompt)
    return [user_message, system_message]

def classify_output(response):
    result_text = response.content
    category = result_text.split("분류: ")[-1].strip()
    return category

classify_chain = RunnableSequence(
    RunnableLambda(classify_input)
    | RunnableLambda(classify_prompt) 
    | llm 
    | RunnableLambda(classify_output)
)

# bot 응답 chain
def get_bot_reply_input(user_input):
    user_message = HumanMessage(content=user_input['user_input'])
    return [user_message]

def get_bot_reply_output(response):
    return response.content
    

get_bot_reply_chain = RunnableWithMessageHistory(
    runnable=RunnableSequence(
        RunnableLambda(get_bot_reply_input)
        | llm
        | RunnableLambda(get_bot_reply_output)
    ),
    get_session_history=get_session_history,
    input_messages_key="user_input",
    history_messages_key="history",
)

# 카테고리 분류 + bot 응답 chain : 메시지 기록
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
    system_message = SystemMessage(content="너는 입력된 문장에서 추천하는 메뉴나 먹기 좋은 메뉴를 추출하는 AI야.")
    user_message = HumanMessage(content=user_prompt)
    return [system_message, user_message]

def get_menu_output(response):
    return response.content.split(",")

# 메뉴 추천 chain : 메시지 기록
get_menu_chain = RunnableSequence(
    RunnableLambda(get_menu_message)
    | llm 
    | RunnableLambda(get_menu_output)
)

def chat(user_message):
    print("="*20)
    session_id = session.get("session_id")
    if session_id is None:
        session_id = str(uuid.uuid4())
        session["session_id"] = session_id

    # 대화의 분류 및 봇 응답을 처리
    output = category_and_bot_reply_chain.invoke({"user_input": user_message}, config={"configurable": {"session_id": session_id}})
    
    link_exist = False
    menus = []
    
    # 메뉴 추천이 필요한 경우
    if output['category'] in [CHAT_MENURCMD, CHAT_MENURCMD_MYTASTE, CHAT_MENURCMD_MYCOND]:
        menus = get_menu_chain.invoke({"user_input": output['reply']}, config={"configurable": {"session_id": session_id}})
        link_exist = True
    
    if len(menus) > 0:
        add_str = "[{}]".format(",".join(menus))
    
    return {"reply": output['reply'], "menus": ",".join(menus), "link_exist": link_exist, "category": output['category'], "session_id": session_id}