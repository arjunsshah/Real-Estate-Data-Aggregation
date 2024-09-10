from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from openai import OpenAI
import pandas as pd
import os
from werkzeug.utils import secure_filename
from langchain.document_loaders import CSVLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.docstore.document import Document
from langchain import PromptTemplate
from langchain.chains import LLMChain
import redis
import json
from langchain.document_loaders import TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
import uuid
import model_testing.chunking_test as chunking_model
import csv

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

r = redis.StrictRedis(host='localhost', port=6379, db=0)


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

        # Get the query from the form data
        query = request.form.get('query', '')

        # Process each CSV file
        dataframes = []
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
        llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        prompt_template = PromptTemplate(
            input_variables=["document", "query"],
            template="Given this data: {document}\n\nAnswer the following question or perform the following task: {query}\n\nProvide your answer in a clear, concise format:",
        )

        chain = LLMChain(llm=llm, prompt=prompt_template)
        response = chain.run(document=document.page_content, query=query)

        return jsonify({
            "output": response
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/visualize_query', methods=['POST'])
def visualize_query():
    query = request.json.get('query')

    # Check if the result is already cached
    cached_data = r.get(query)

    if cached_data:
        # If data is cached, return it
        print('in redis cache')
        return jsonify(json.loads(cached_data))

    # Else, compute the result and cache it
    if query == "Show sales by month for 2024":
        data = {
            "labels": ["January", "February", "March", "April", "May", "June"],
            "data": [120, 190, 300, 500, 250, 320],
            "chartType": "bar"
        }

        # Cache the result in Redis (with an optional expiration time)
        r.set(query, json.dumps(data), ex=60*60*24)  # Cache for 24 hours

        return jsonify(data)

    else:
        return jsonify({"error": "Unknown query"}), 400
 

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'files' not in request.files:
        return jsonify({"message": "No file part in the request"}), 400

    files = request.files.getlist('files')  # This handles multiple files
    print(f"FILES: {files}")
    
    uploaded_files = []
    
    for file in files:
        if file.filename == '':
            return jsonify({"message": "No selected file"}), 400

        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        uploaded_files.append(filename)

    return jsonify({"message": "Files uploaded successfully", "filenames": uploaded_files}), 200
    

@app.route('/embed_documents_for_retrieval', methods=['POST'])
def embed_documents():
    """
    Embed documents and allow them to be queried for retreival
    """
    csv_files = chunking_model.list_files_in_uploads()
    print(csv_files)
    chunking_model.process_csv_documents(csv_files)
    return jsonify({"message": "Documents embedded and stored successfully!"})

@app.route('/query_documents', methods=['POST'])
def query_documents():
    """
    Query Embedded Documents
    """
    query = request.json.get('query')
    result = chunking_model.run_query(query)
    return jsonify({"result": result}), 200

@app.route('/files', methods=['GET'])
def get_files():
    files = []
    for filename in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.isfile(file_path):
            files.append({
                'name': filename,
                'size': os.path.getsize(file_path),
                'date': os.path.getmtime(file_path)
            })
    return jsonify(files)


if __name__ == '__main__':
    app.run(debug=True)

