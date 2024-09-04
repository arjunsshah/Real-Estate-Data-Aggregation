from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import uuid
import pandas as pd
import os
from langchain.document_loaders import CSVLoader
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.docstore.document import Document
from langchain.llms import OpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain

from langchain.llms import OpenAI
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.docstore import InMemoryDocstore
from langchain.document_loaders import TextLoader

import csv

app = Flask(__name__)
CORS(app)



# In-memory storage to hold conversation states
sessions = {}

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the conversation API!'})

@app.route('/process-data', methods=['POST'])
def handle_process_data():
    return process_data()



def process_data():
    # Function to load CSV file
    def load_csv_file(file):
        content = ""
        stream = file.stream.read().decode("utf-8")
        reader = csv.reader(stream.splitlines())
        for row in reader:
            content += ", ".join(row) + "\n"
        return Document(page_content=content, metadata={"source": file.filename})


    try:
        # Check if files were uploaded
        if 'files' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        files = request.files.getlist('files')
        
        if not files or files[0].filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Process each CSV file
        dataframes = []
        first_file = None
        for file in files:
            if file and file.filename.endswith('.csv'):
                file_content = load_csv_file(file)
                dataframes.append(file_content)
            else:
                return jsonify({"error": f"Invalid file format for {file.filename}"}), 400

        # Combine all DataFrames (if needed) and prepare the document for the LLM
        combined_content = "\n".join([doc.page_content for doc in dataframes])
        document = Document(page_content=combined_content, metadata={"source": "combined_csv"})

        # Initialize the LLM and the embeddings
        llm = OpenAI(api_key="")

        prompt_template = PromptTemplate(
            input_variables=["document"],
            template="Given this data, what are some trends that you notice. Return your answer in a numerical list format: {document}",
        )

        chain = LLMChain(llm=llm, prompt=prompt_template)
        response = chain.run(document=document.page_content)

        return jsonify({
            "output": response
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
