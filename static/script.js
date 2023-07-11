'use strict';

class BoggleGame{
    // make a new boggle game

    constructor(secs = 60) {
        this.words = new Set();
        this.score = 0;

        this.secs = secs;
        this.showTimer();

        // this.board = $("#" + boardId);

        this.timer = setInterval(this.tick.bind(this), 1000);

        // $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    showMessage(msg) {
        $('#messages').text(msg);
        console.log(msg);
    }

    // show word in list
    showWord(word){
        // $(".words", this.board).append($("<li>", {text: word}));
        $(".words").append($("<li>", {text: word}));
    }

    showTimer() {
        $("#countdown").text(this.secs);
    }

    // update timer with passing seconds
    async tick() {
        this.secs -= 1;
        this.showTimer();

        if (this.secs === 0) {
            clearInterval(this.timer);
            document.getElementById("word").disabled = true;
            document.getElementById("word-submit-button").disabled = true;
            await this.scoreGame();
        }
    }

    // update score

    async scoreGame() {
        // $(".add-word", this.board).hide();
        const response = await axios.post("/board/score", {score:this.score});
        if (response.data.brokeRecord) {
            this.showMessage(`New record: ${this.score}`);
        } else {
            this.showMessage(`Final score: ${this.score}`);
        }
    }

    async checkWord(e) {
        e.preventDefault();
        /* using JQuery and axios, make an AJAX request to send it to the server */
        const word = $("input#word").val().toLowerCase();
        const response = await axios.get(`${window.origin}/board/check`, {params : {word}});
        console.log(response);

        if (response.data.result === "ok") {
            // check if word is unique:
            if (this.words.has(word)) {
                this.showMessage(`Already found ${word}`);
                console.log('this words list already has the word entered');
            }
            else {
                /* If a valid word is guessed, add its score and update on the page */
                this.words.add(word);
                this.score += word.length;
                $('#score').text(`${this.score}`);
                this.showWord(word);
                this.displayMsg("You got it!");
                $('input#word').val('')
                console.log('this word added to words')
            }
        } else if (response.data.result === "not-on-board") {
            this.showMessage(`sorry, ${word} was not found on board`);
            console.log('response.data.result was not a word');

        } else {
            this.showMessage(`hmm... ${word} was not recognized`);
            console.log('response.data.result not a word');
        }
        $('input#word').val('');
    }
};

const boggleGame = new BoggleGame();

$('#word-submit-form').on('submit', async function(event){
    await boggleGame.checkWord(event);
    console.log('form submitted')
});

    