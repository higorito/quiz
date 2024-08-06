from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

quiz_data = [
    {
        "question": "Qual é a função principal do Flask?",
        "options": ["Framework para desenvolvimento web em Python", "Banco de dados relacional", "Editor de código", "Sistema de gerenciamento de pacotes"],
        "correct_answer": "Framework para desenvolvimento web em Python"
    },
    {
        "question": "O que é PythonAnywhere?",
        "options": ["Um IDE para Python", "Uma plataforma de hospedagem para aplicativos Python", "Um framework de teste para Python", "Uma biblioteca para análise de dados"],
        "correct_answer": "Uma plataforma de hospedagem para aplicativos Python"
    },
    {
        "question": "Qual é uma característica típica de uma aplicação SaaS (Software as a Service)?",
        "options": ["Licença perpétua", "Execução local no computador do usuário", "Acesso baseado em assinatura e através da web", "Desenvolvimento de código aberto"],
        "correct_answer": "Acesso baseado em assinatura e através da web"
    },
    {
        "question": "Qual comando é utilizado para iniciar um servidor Flask no terminal?",
        "options": ["flask run", "python manage.py runserver", "flask start", "python app.py"],
        "correct_answer": "flask run"
    },
    {
        "question": "Qual é a principal vantagem de usar uma plataforma SaaS para um aplicativo de negócios?",
        "options": ["Redução de custos com hardware e manutenção", "Necessidade de desenvolvimento local", "Controle completo sobre o código fonte", "Desempenho superior ao local"],
        "correct_answer": "Redução de custos com hardware e manutenção"
    }
]


user_scores = []

@app.route('/api/quiz', methods=['GET'])
def get_quiz():
    return jsonify(quiz_data)

@app.route('/api/start', methods=['POST'])
def start_quiz():
    data = request.json
    user_name = data.get('name')
    if not user_name:
        return jsonify({"error": "Name is required"}), 400
    return jsonify({"message": f"Welcome, {user_name}!"})

@app.route('/api/submit', methods=['POST'])
def submit_quiz():
    data = request.json
    user_name = data.get('name')
    answers = data.get('answers')
    
    if not user_name or not answers:
        return jsonify({"error": "Name and answers are required"}), 400

    score = 0
    for answer in answers:
        question = answer.get('question')
        given_answer = answer.get('answer')
        for q in quiz_data:
            if q["question"] == question and q["correct_answer"] == given_answer:
                score += 1
                
    user_scores.append({"name": user_name, "score": score})
    
    return jsonify({"score": score})

@app.route('/api/rankings', methods=['GET'])
def get_rankings():
    sorted_scores = sorted(user_scores, key=lambda x: x["score"], reverse=True)
    return jsonify(sorted_scores)

@app.route('/')
def serve_index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

