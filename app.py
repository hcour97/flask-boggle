from flask import Flask, request, session, render_template, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "so-secret"

boggle_game = Boggle()

@app.route("/")
def show_board():
    """Show gameboard"""
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays",0)

    return render_template("index.html", board=board, highscore=highscore, nplays=nplays)

@app.route("/check-word")
def check_word():
    """Checks user word to see if it is valid."""

    word = request.form["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({"result:", response})

@app.route("/post-score", methods=["POST"])
def post_score():
    """Receive score, update nplays, update highscore if necessary"""

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session["nplays"] = nplays + 1
    session["highscore"] = max(score, highscore)

    return jsonify(brokenRecord = score > highscore)
