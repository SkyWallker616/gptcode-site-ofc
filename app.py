from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from dotenv import load_dotenv
import secrets

# Carrega as variáveis de ambiente do arquivo .env
# Esta linha deve vir antes de qualquer uso de os.environ.get()
load_dotenv()

app = Flask(__name__)

# Configure secret key for session (used by flash()). Prefer a persistent
# value in environment (.env) for production. If not set, fall back to a
# generated temporary key (OK for local development but will invalidate
# sessions across restarts).
env_secret = os.environ.get('FLASK_SECRET_KEY')
if env_secret:
    app.secret_key = env_secret
else:
    # generate a dev-only secret and warn the developer
    temp_key = secrets.token_urlsafe(32)
    app.secret_key = temp_key
    print("WARNING: FLASK_SECRET_KEY is not set. Using a temporary secret key for development.\n"
          "Set FLASK_SECRET_KEY in your environment or .env file for persistent sessions in production.")

# Configurações de e-mail (substitua pelos seus dados reais ou variáveis de ambiente)
# É ALTAMENTE RECOMENDADO usar variáveis de ambiente para credenciais em produção.
SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD') # Use a SENHA DE APP gerada pelo Google
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 465)) # Porta SSL

# E-mail do professor para onde as mensagens serão enviadas
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'gabrielzvd616@gmail.com')
# Test mode: when set to '1' or 'true' (case-insensitive), do not attempt SMTP
EMAIL_TEST_MODE = os.environ.get('EMAIL_TEST_MODE', '0').lower() in ('1', 'true', 'yes')

# Rotas para as páginas estáticas
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contato', methods=['GET', 'POST'])
def contato():
    if request.method == 'POST':
        name = request.form.get('nome')
        email = request.form.get('email')
        phone = request.form.get('telefone')
        subject_form = request.form.get('assunto')
        institution = request.form.get('instituicao')
        message_body = request.form.get('mensagem')

        # Validação para garantir que as variáveis de ambiente estão configuradas
        if not SENDER_EMAIL or not SENDER_PASSWORD:
            print("ERRO: As variáveis de ambiente SENDER_EMAIL e SENDER_PASSWORD não estão configuradas.")
            flash('Erro de configuração no servidor. O administrador foi notificado.', 'danger')
            return render_template('contato.html'), 500

        if not all([name, email, subject_form, message_body]):
            flash('Por favor, preencha todos os campos obrigatórios.', 'warning')
            return render_template('contato.html'), 400

        try:
            # Prepare message body
            body_text = f"Nome Completo: {name}\nE-mail: {email}\nTelefone: {phone if phone else 'Não informado'}\nAssunto: {subject_form}\nInstituição/Empresa: {institution if institution else 'Não informado'}\n\nMensagem:\n{message_body}"

            if EMAIL_TEST_MODE:
                # In test mode we don't send email; just simulate success and print the body
                print("[EMAIL_TEST_MODE] Simulated send to: ", RECIPIENT_EMAIL)
                print(body_text)
                flash('Modo de teste: mensagem simulada com sucesso.', 'success')
                return redirect(url_for('contato'))

            msg = MIMEMultipart()
            msg['From'] = formataddr(('Contato GPTCode', SENDER_EMAIL))
            msg['To'] = RECIPIENT_EMAIL
            msg.add_header('Reply-To', email)
            msg['Subject'] = f"[GPTCode Contato] {subject_form} - {name}"
            msg.attach(MIMEText(body_text, 'plain'))

            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
                server.login(SENDER_EMAIL, SENDER_PASSWORD)
                server.send_message(msg)

            flash('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success')
            return redirect(url_for('contato'))

        except Exception as e:
            print(f"Erro ao enviar e-mail: {e}")
            flash('Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.', 'danger')
            return render_template('contato.html'), 500
            
    return render_template('contato.html')

@app.route('/equipe')
def equipe():
    return render_template('equipe.html')

@app.route('/publicacoes')
def publicacoes():
    return render_template('publicacoes.html')

@app.route('/devs')
def devs():
    return render_template('devs.html')

@app.route('/projetos')
def projetos():
    return render_template('projetos.html')

# Rota de exemplo para detalhes da publicação
@app.route('/publicacao/<int:pub_id>')
def publicacao_detalhe(pub_id):
    # No futuro, você pode buscar os dados da publicação com base no pub_id
    return render_template('publicacao_detalhe.html', pub_id=pub_id)

if __name__ == '__main__':
    app.run(debug=True)