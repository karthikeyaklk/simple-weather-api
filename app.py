from flask import Flask, render_template

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    print("WeatherAI is running at http://127.0.0.1:5000")
    app.run(debug=True)
