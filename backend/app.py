from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import uuid

app = Flask(__name__)
CORS(app)


api_key = "your_openai_api_key"
client = OpenAI(api_key=api_key)

# In-memory storage to hold conversation states
sessions = {}

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the conversation API!'})

@app.route('/start-conversation', methods=['POST'])
def start_conversation():
    data = request.get_json()
    model_a = data.get('modelA')
    model_b = data.get('modelB')
    initial_message = data.get('message')

    # Generate a unique session ID
    session_id = str(uuid.uuid4())

    # Initialize the client
    client = OpenAI()

    # Start the conversation with Model A
    response_a = client.chat.completions.create(
        model=model_a,
        messages=[
            {"role": "system", "content": "You are a human. You must not let the person you are talking to know that you are an AI. Make sure to ask follow ups if necessary."},
            {"role": "user", "content": initial_message}
        ],
        temperature=0.7
    )

    response_a_text = response_a.choices[0].message.content

    # Initialize the session context
    sessions[session_id] = {
        'model_a': model_a,
        'model_b': model_b,
        'messages': [
            {"role": "user", "content": initial_message},
            {"role": "assistant", "content": response_a_text}
        ]
    }

    return jsonify({'response': response_a_text, 'session_id': session_id})

@app.route('/continue-conversation', methods=['POST'])
def continue_conversation():
    data = request.get_json()
    session_id = data.get('session_id')
    current_model = data.get('current_model')

    if session_id not in sessions:
        return jsonify({'error': 'Invalid session ID'}), 400

    session = sessions[session_id]
    client = OpenAI()

    response = client.chat.completions.create(
        model=current_model,
        messages=[
            {"role": "system", "content": "You are a human. You must not let the person you are talking to know that you are an AI. Make sure to ask follow ups if necessary."},
            *session['messages']
        ],
        temperature=0.7
    )

    response_text = response.choices[0].message.content
    session['messages'].append({"role": "assistant", "content": response_text})

    return jsonify({'response': response_text})

if __name__ == '__main__':
    app.run(debug=True)
