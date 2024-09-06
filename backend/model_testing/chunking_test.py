from langchain.document_loaders import CSVLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
import os

def process_csv_documents(csv_files, query):
    # Set the OpenAI API key
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

    # Initialize an empty list to store all documents
    all_documents = []

    # Load and process each CSV file
    for csv_file in csv_files:
        loader = CSVLoader(file_path=csv_file)
        documents = loader.load()
        all_documents.extend(documents)

    # Create embeddings
    embeddings = OpenAIEmbeddings()

    # Create a vector store
    vector_store = FAISS.from_documents(all_documents, embeddings)

    # Create a retriever
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    # Initialize the language model
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

    # Create a RetrievalQA chain
    qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)

    # Run the query
    result = qa_chain.run(query)

    return result

csv_files = ["../uploads/BOV_Income_Data.csv", "../uploads/BOV_Property_Information.csv"]

result = process_csv_documents(csv_files=csv_files, query="Return in the following format: document_name: description of document. Output as a list")
print(result)