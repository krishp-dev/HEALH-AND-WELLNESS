from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

# Set your OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY', 'your_openai_api_key_here')

app = Flask(__name__)
CORS(app)

# Predefined health context for more accurate responses
HEALTH_CONTEXTS = {
    'mental': """You are a compassionate mental health assistant. 
    Provide supportive, professional advice about mental wellness, 
    stress management, and emotional balance.""",
    
    'physical': """You are a professional fitness and physical health advisor. 
    Provide scientifically-backed advice about exercise, 
    fitness routines, and physical wellness.""",
    
    'nutrition': """You are a registered dietitian and nutrition expert. 
    Provide evidence-based nutritional advice, dietary recommendations, 
    and healthy eating strategies.""",
    
    'telehealth': """You are a telemedicine professional. 
    Provide guidance about remote healthcare, 
    medical consultations, and health monitoring."""
}

@app.route('/chat', methods=['POST'])
def chat_with_ai():
    data = request.json
    user_message = data.get('message', '')
    category = data.get('category', 'mental')
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": HEALTH_CONTEXTS.get(category, HEALTH_CONTEXTS['mental'])},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message['content'].strip()
        return jsonify({"response": ai_response})
    
    except Exception as e:
        return jsonify({"response": f"Sorry, I encountered an error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)