from langchain.document_loaders import CSVLoader
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
import os

from flask import request, jsonify

FAISS_INDEX_PATH = "faiss_index"


def list_files_in_uploads():
    folder_path = os.path.join(os.getcwd(), "uploads")
    current_directory = os.getcwd()
    print(f"Current working directory: {current_directory}")

    
    try:
        files = os.listdir(folder_path)
        file_names = [os.path.join("uploads", file) for file in files if os.path.isfile(os.path.join(folder_path, file))]
        return file_names
    except FileNotFoundError:
        return f"Folder {folder_path} does not exist."



# Add Metadata to each CSV file so the model knows where the info is located
def load_csv_with_metadata(file_path):
    loader = CSVLoader(file_path)
    documents = loader.load()
    file_name = os.path.basename(file_path)
    for doc in documents:
        doc.metadata['source'] = file_name
        doc.page_content = f"File: {file_name}\n\n" + doc.page_content
    return documents


def process_csv_documents(csv_files):
    # Set the OpenAI API key
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

    # Initialize an empty list to store all documents
    all_documents = []

    # Load and process each CSV file
    for csv_file in csv_files:
        documents = load_csv_with_metadata(csv_file)
        all_documents.extend(documents)


    # Create embeddings
    embeddings = OpenAIEmbeddings()

    # Create a vector store
    vector_store = FAISS.from_documents(all_documents, embeddings)

    vector_store.save_local(FAISS_INDEX_PATH)

def determine_chart_type(query):

    if not query:
        return jsonify({"error": "Missing OpenAI API key or query"}), 400
    
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
    
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
    qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=vector_store.as_retriever())

    chart_query = f"""Given the following user query, determine the document they are referring to. 
    
                    Then determine what chart (bar, line) would best be suited for that document. 

                    Only return the document name and the chart type in the form: document_name, chart_type 

                    Do not include any other text or words.

                    Here is the user query: {query}
                    
                    """

    result = qa_chain.run(chart_query)

    # result = qa_chain.run(query)

    return result
    





def run_query(query):
    # query = request.json.get('query')
    # query = "What is in BOV Income data file"

    if not query:
        return jsonify({"error": "Missing OpenAI API key or query"}), 400
    
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
    
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
    qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=vector_store.as_retriever())

    chart_query = f"""Given the following user query, determine the document they are referring to. 

                Only return the document the user is referring to in their query.

                Here is the user query: {query}
                
                """

    result = qa_chain.run(chart_query)

    # result = qa_chain.run(query)

    return result





# csv_files = ["../uploads/BOV_Income_Data.csv", "../uploads/BOV_Property_Information.csv"]

# process_csv_documents(csv_files=csv_files)
# result = run_query()
# print(result)
