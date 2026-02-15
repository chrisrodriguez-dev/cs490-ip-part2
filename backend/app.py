import os
import urllib.parse
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from dotenv import load_dotenv


app = Flask(__name__, template_folder="../frontend/templates")


load_dotenv()

raw_password = os.getenv('DB_PASSWORD') #This turns the '@' into '%40' so the URL doesn't break
safe_password = urllib.parse.quote_plus(raw_password)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{safe_password}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

DB_USER = os.getenv('DB_USER') or "root"
DB_PASSWORD = os.getenv('DB_PASSWORD') or "part2"
DB_HOST = os.getenv('DB_HOST') or "127.0.0.1"
DB_PORT = os.getenv('DB_PORT') or "3306"
DB_NAME = os.getenv('DB_NAME') or "sakila"


def run_query(query):
    """Helper function to run a query and return results as a list of dicts."""
    result = db.session.execute(text(query)).mappings().all()
    return [dict(row) for row in result]

@app.route("/")
def index():
    return "Hello, World!"

# this decorator tells flask what URL should activate this function
@app.route("/api/landing-page", methods=['GET']) # 1. Change to GET
def landing_page():
    query1 = """
    SELECT f.film_id, f.title, c.name AS CategoryName, COUNT(r.rental_id) as TimesRented 
    FROM film f 
    JOIN film_category fc ON fc.film_id = f.film_id 
    JOIN category c ON fc.category_id = c.category_id 
    JOIN inventory i on i.film_id = f.film_id 
    JOIN rental r on r.inventory_id = i.inventory_id 
    GROUP BY f.film_id, f.title, CategoryName 
    ORDER BY TimesRented DESC LIMIT 5;
    """
    query2 = """
    SELECT 
        a.actor_id, a.first_name, a.last_name, COUNT(r.rental_id) AS total_rentals
    FROM actor a
    JOIN film_actor fa ON a.actor_id = fa.actor_id
    JOIN inventory i ON fa.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    GROUP BY a.actor_id, a.first_name, a.last_name
    ORDER BY total_rentals DESC
    LIMIT 5;
    """
    #Package it in a dictionary so React can find "movies"
    return jsonify({
        "movies": run_query(query1), 
        "actorMovies": run_query(query2)
    })


@app.route("/api/film/<int:film_id>", methods=['GET'])
def get_film_details(film_id):
    query = text("""
    SELECT 
    f.title, 
    f.description, 
    f.release_year, 
    f.rating, 
    f.special_features,
    f.length,
    c.name AS category
FROM film f
JOIN film_category fc ON f.film_id = fc.film_id
JOIN category c ON fc.category_id = c.category_id
WHERE f.film_id = :id;
    """)
    
    # Pass the variable as a dictionary to bind it to :id
    result = db.session.execute(query, {"id": film_id}).mappings().first()
    if result:
        return jsonify(dict(result))
    return jsonify({"error": "Film not found"}), 404 
    
@app.route("/api/actor/<int:actor_id>", methods=['GET'])
def get_actor_details(actor_id):
    query = text("""
    SELECT 
        a.first_name, 
        a.last_name, 
        f.title, 
        f.release_year,
        COUNT(r.rental_id) as total_rentals
    FROM actor a
    JOIN film_actor fa ON a.actor_id = fa.actor_id
    JOIN film f ON fa.film_id = f.film_id
    JOIN inventory i ON f.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    WHERE a.actor_id = :id
    GROUP BY a.actor_id, a.first_name, a.last_name, f.film_id, f.title, f.release_year
    ORDER BY total_rentals DESC
    LIMIT 5;
    """)
    
    result = db.session.execute(query, {"id": actor_id}).mappings().all()
    
    if result:
        print(result)
        return jsonify([dict(row) for row in result])
    else:
        return jsonify({"error": "Actor not found"}), 404

@app.route("/api/search/<search_criteria>")
def search_films(search_criteria):
    search_term = f"%{search_criteria}%"
    query = text("""
        SELECT DISTINCT f.film_id, f.title, f.description, c.name AS genre
        FROM film f
        JOIN film_category fc ON f.film_id = fc.film_id
        JOIN category c ON fc.category_id = c.category_id
        JOIN film_actor fa ON f.film_id = fa.film_id
        JOIN actor a ON fa.actor_id = a.actor_id
        WHERE f.title LIKE :val 
           OR c.name LIKE :val 
           OR a.first_name LIKE :val 
           OR a.last_name LIKE :val
    """)
    result = db.session.execute(query, {"val": search_term}).mappings().all()
    return jsonify([dict(row) for row in result])

#film details api
@app.route("/api/film-details/<int:film_id>")
def film_details(film_id):
    query = text("SELECT * FROM film WHERE film_id = :val")
    result = db.session.execute(query, {"val": film_id}).mappings().first()
    if result:
        return jsonify(dict(result)) 
    return jsonify({"error": "Film not found"}), 404



@app.route('/test-db')
def test_db():
    try:
        query = text("SELECT 'Connection Successful' as status")
        result = db.session.execute(query).mappings().first()
        return jsonify(dict(result)) 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)