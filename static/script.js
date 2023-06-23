class BoggleGame{
    // make a new boggle game

    constructor(boardId, secs = 60) {
        this.secs = secs;
        this.showTimer();
        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId);

        this.timer = setInterval(this.tick.bind(this), 1000);

        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    // show word in list
    showWord(word){
        $(".words", this.board).append($("<li>", {text: word}));
    }
    // show score in html
    showScore() {
        $(".score", this.board).text(this.score);
    }

    // show status message
    showMessage(message, cls) {
        $(".msg", this.board)
        .text(message)
        .removeClass()
        .addClass(`msg ${cls}`);
    }

    // handle submission, if new & valid, add to score & show
    async handleSubmit(e) {
        e.preventDefault();
        // get the word from the form:

        const $word = $(".word", this.board);
        let word = $word.val();
        if (!word) return;

        // check if word is unique:
        if (this.words.has(word)) {
            this.showMessage(`Already found ${word}`, "err");
            return;
        }

        // verify the input is a word:
        const response = await axios.get("/check-word", {params: {word : word}});
        // show message for not a word
        if (response.data.result === "not-word") {
            this.showMessage(`${word} is not a valid word`, "err")
        }

        // show message for not a word on this board
        else if (response.data.result === "not-on-board") {
            this.showMessage(`${word} cannot be found on the board`, "err")
        }

        // else: show the word, increase score, append to words, and show valid message
        else {
            this.showWord(word);
            this.score += word.length;
            this.showScore();
            this.words.add(word);
            this.showMessage(`great find! ${word} has been added.`, "ok")
        }
        
        // reset word value:
        $word.val("").focus();
    }

    // update timer
    showTimer() {
        $(".timer", this.board).text(this.secs);
    }

    // update timer with passing seconds
    async tick() {
        this.secs -= 1;
        this.showTimer();

        if (this.secs === 0) {
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    // update score

    async scoreGame() {
        $(".add-word", this.board).hide();
        const response = await axios.post("/post-score", {score:this.score});
        if (response.data.brokeRecord) {
            this.showMessage(`New record: ${this.score}`, "ok");
        } else {
            this.showMessage(`Final score: ${this.score}`, "ok");
        }
    }
}