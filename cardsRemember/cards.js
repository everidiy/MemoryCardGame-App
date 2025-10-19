class MemoryCard {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matchedPairs = 0;
        this.time = 60;
        this.timerInterval = null;
        this.setupHandleBtn();
    }

    initializeGame() {
        const emoji = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];
        const pairs = [...emoji, ...emoji];

        this.cards = pairs.map((smile, index) => {
            return {
                emoji: smile, 
                id: index, 
                flipped: false,
                matched: false
            }
        })

        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderGrid() {
        const grid = document.getElementById('memory-grid');
        grid.innerHTML = "";

        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = "memory-card";

            if (card.flipped || card.matched) {
                cardElement.textContent = card.emoji;
            } else {
                cardElement.textContent = "?";
            }

            cardElement.addEventListener("click", () => {
                const clickedCard = this.cards.find(c => c.id === card.id);

                if (clickedCard.flipped || clickedCard.matched || this.flippedCards.length === 2) return;

                clickedCard.flipped = true;
                this.flippedCards.push(clickedCard);

                this.renderGrid();

                if (this.flippedCards.length === 2) {
                    this.checkMatch()
                }
            });

            grid.appendChild(cardElement);
        })
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        this.moves++;

        if (card1.emoji === card2.emoji) {
            card1.matched = true;
            card2.matched = true;
            this.matchedPairs++;
            this.flippedCards = []
            this.renderGrid()
        } else {
            setTimeout(() => {
                card1.flipped = false;
                card2.flipped = false;
                this.flippedCards = []
                this.renderGrid()
            }, 500)
        }

        if (this.matchedPairs === this.cards.length / 2) {
            setTimeout(() => {
                this.showWinMessage();

                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                }
            }, 300)
        }

        this.updateStats()
    }

    updateStats() {
        const steps = document.getElementById("moves");
        steps.textContent = this.moves;
    }

    showWinMessage() {
        document.getElementById("custom-alert").style.display = "flex";
        document.getElementById('win-moves').textContent = this.moves;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    showLoseMessage() {
        document.getElementById("custom-alert").style.display = "flex";
        document.getElementById('win-moves').textContent = this.moves;
        document.querySelector('h2').textContent = "You lose!";

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    setupHandleBtn() {
        document.getElementById('alert-close-btn').addEventListener("click", () => {
            document.getElementById("custom-alert").style.display = "none";
            this.restartGame();
        })
    }

    timer() {
        let currentTime = this.time;
        document.getElementById('timer').textContent = currentTime;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            currentTime--;
            document.getElementById('timer').textContent = currentTime;

            if (currentTime <= 0) {
                this.showLoseMessage();
            }
        }, 1000)
    }

    restartGame() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matchedPairs = 0;
        this.time = 60;
        this.initializeGame();
        this.renderGrid();
        this.timer();
        this.updateStats();

        document.querySelector('h2').textContent = "You Win!";
    }
}

const game = new MemoryCard();
game.initializeGame();
game.renderGrid();
game.timer();
