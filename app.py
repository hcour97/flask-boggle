from flask import Flask, request, session, render_template, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle
import sys
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = "so-secret"
app.config["TESTING"] = True
app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]
debug = DebugToolbarExtension(app)
app.secret_key = "secret!"

boggle_game = Boggle()
words = set(boggle_game.words)

@app.route("/")
def start():
    """Show instruction page."""
    return render_template("index.html")

@app.route("/board")
def show_board():
    """Show gameboard"""
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays",0)

    return render_template("board.html", board=board, highscore=highscore, nplays=nplays)

@app.route("/board/check")
def check_word():
    """Checks user word to see if it is valid."""

    word = request.args["word"] # get word from the form
    board = session["board"] # get the board from saved session
    # should return a string: "ok", "not-on'board", "not-word"
    response = boggle_game.check_valid_word(board, word)
    # print('Hello world!', file = sys.stderr)
    return jsonify({'result': response})
    
    # respond with JSON because AJAX request was made to server
    # return jsonify({"result:", response})

@app.route("/board/score", methods=["POST"])
def post_score():
    """Receive score, update nplays, update highscore if necessary"""

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session["nplays"] = nplays + 1
    session["highscore"] = max(score, highscore)

    return jsonify(brokenRecord = score > highscore)

# print('This is standard output', file=sys.stdout)
