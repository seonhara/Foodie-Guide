#!/usr/bin/env python
# coding: utf-8


import json
from pathlib import Path
from pprint import pprint
from langchain_text_splitters import RecursiveJsonSplitter
import json
import os
from langchain_openai import OpenAIEmbeddings
# from sklearn.metrics.pairwise import cosine_similarity
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

# 디스크에서 문서를 로드합니다.
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
# 단계 6: 프롬프트 생성(Create Prompt)
# 프롬프트를 생성합니다.
prompt = PromptTemplate.from_template(
    """You are a chef who recommends suitable food menus based on people's situations. No matter the situation, you suggest a food menu, and if someone has a specific dish in mind, you recommend a restaurant that serves it.

Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Answer in Korean.

#Previous Chat History:
{chat_history}

#Question:
{question}

#Context:
{context}

#Answer:"""
)

# 단계 7: 언어모델(LLM) 생성

llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo", verbose=True)
# llm = ChatOpenAI(model_name="gpt-4o", temperature=0)

# 단계 8: 체인(Chain) 생성
chain = (
    {
        "context": itemgetter("question") | retriever,
        "question": itemgetter("question"),
        "chat_history": itemgetter("chat_history"),
    }
    | prompt
    | llm
    | StrOutputParser()
)



# 세션 기록을 저장할 딕셔너리
store = {}


# 세션 ID를 기반으로 세션 기록을 가져오는 함수
def get_session_history(session_ids):
    print(f"[대화 세션ID]: {session_ids}")
    if session_ids not in store:  # 세션 ID가 store에 없는 경우
        # 새로운 ChatMessageHistory 객체를 생성하여 store에 저장
        store[session_ids] = ChatMessageHistory()
    return store[session_ids]  # 해당 세션 ID에 대한 세션 기록 반환


# 대화를 기록하는 RAG 체인 생성
rag_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,  # 세션 기록을 가져오는 함수
    input_messages_key="question",  # 사용자의 질문이 템플릿 변수에 들어갈 key
    history_messages_key="chat_history",  # 기록 메시지의 키
)

def get_messages(user_message):
    bot_result = rag_with_history.invoke(
        # 질문 입력
        {"question": user_message},
        # 세션 ID 기준으로 대화를 기록합니다.
        config={"configurable": {"session_id": "rag123"}},
    )
    json_response = json.dumps(bot_result, indent=4, default=str)
    data = json.loads(json_response)
        
    return {"reply": data}

# rag_with_history.invoke(
#     # 질문 입력
#     {"question": "HIV 감염 검사의 요소에 뭐가 있어?"},
#     # 세션 ID 기준으로 대화를 기록합니다.
#     config={"configurable": {"session_id": "rag123"}},
# )



# rag_with_history.invoke(
#     # 질문 입력
#     {"question": "이전 답변을 영어로 번역해줘"},
#     # 세션 ID 기준으로 대화를 기록합니다.
#     config={"configurable": {"session_id": "rag123"}},
# )


