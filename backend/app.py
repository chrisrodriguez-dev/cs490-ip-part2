import os
import urllib.parse
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

raw_password = os.getenv('DB_PASS')
# This turns the '@' into '%40' so the URL doesn't break
safe_password = urllib.parse.quote_plus(raw_password)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{safe_password}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')


# this decorator tells flask what URL should activate this function
@app.route("/")
def hello_world():
    return "<h>Hello there</h>"

@app.route('/test-db')
def test_db():
    try:
        # A simple query to make sure the handshake works
        query = text("SELECT 'Connection Successful' as status")
        result = db.session.execute(query).mappings().first()
        
        # We turn the result into a dictionary so jsonify can handle it
        return jsonify(dict(result)) 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run()