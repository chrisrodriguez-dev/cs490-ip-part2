from flask import Flask

app = Flask(__name__)

# this decorator tells flask what URL should activate this function
@app.route("/")
def hello_world():
    return "<h>Hello there</h>"

if __name__ == "__main__":
    app.run()