import os
import urllib.parse
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from dotenv import load_dotenv

app = Flask(__name__, template_folder="../frontend/templates")

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


def run_query(query):
    """Helper function to run a query and return results as a list of dicts."""
    result = db.session.execute(text(query)).mappings().all()
    return [dict(row) for row in result]

# this decorator tells flask what URL should activate this function
@app.route("/", methods=['GET', 'POST'])
def hello_world():
    if request.method == 'POST':
        query = """
        SELECT f.film_id, f.title, c.name AS CategoryName, COUNT(r.rental_id) as TimesRented 
        FROM film f 
        JOIN film_category fc ON fc.film_id = f.film_id 
        JOIN category c ON fc.category_id = c.category_id 
        JOIN inventory i on i.film_id = f.film_id 
        JOIN rental r on r.inventory_id = i.inventory_id 
        GROUP BY f.film_id, f.title, CategoryName 
        ORDER BY TimesRented DESC LIMIT 5;
        """
        return render_template("index.html", films=run_query(query))
    return render_template("index.html", films=[])


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