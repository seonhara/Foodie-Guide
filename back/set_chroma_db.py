#!/usr/bin/env python
from google.colab import drive
drive.mount('/content/gdrive')

from pathlib import Path
from pprint import pprint
import openai
import os
from dotenv import load_dotenv
import json
from langchain_text_splitters import RecursiveJsonSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

# 데이터 폴더 경로 설정
# train_data_path = Path("/content/gdrive/MyDrive/food-data/train/data")
# train_data_path = Path("/content/gdrive/MyDrive/food-data/train/data/1.질문/감염성질환/결핵/식이, 생활")

# # JSON 파일 로드
# def loadJson(base_path):
#   json_files = base_path.rglob("*.json")
#   data_list = {}
#   for file in json_files:
#       try:
#           data = json.loads(file.read_text(encoding="utf-8"))
#           data_list[data['fileName']] = data
#       except json.JSONDecodeError as e:
#           print(f"Error decoding JSON in {file}: {e}")
#   return data_list

# train_data = loadJson(train_data_path)
# print(train_data)



# file_path = '/content/gdrive/MyDrive/food-data/health_data.json'


# # JSON 파일 저장
# with open(file_path, 'w') as json_file:
#     json.dump(train_data, json_file)

# print(f"파일이 저장되었습니다: {file_path}")


# 저장된 파일 불러오기
file_path = '/content/gdrive/MyDrive/food-data/health_data.json'
train_data = json.loads(Path(file_path).read_text(encoding="utf-8"))
pprint(train_data)


# 데이터 split

splitter = RecursiveJsonSplitter(max_chunk_size=300)
json_chunks = splitter.split_json(json_data=train_data)

docs = splitter.create_documents(texts=[train_data])


load_dotenv()
openai_api_key = os.environ.get('OPENAI_API_KEY')

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# DB 생성
persist_db = Chroma.from_documents(
    documents=docs, embedding=embeddings, collection_name="health_chroma_test", persist_directory="/content/gdrive/MyDrive/Colab Notebooks/chroma"
)