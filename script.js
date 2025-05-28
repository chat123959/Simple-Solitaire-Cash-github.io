// Game variables
let coins = 100;
let time = 0;
let timer;
let gameBoard = [];
let selectedCard = null;
let moveHistory = [];

// DOM Elements
const coinsDisplay = document.getElementById('coins');
const timeDisplay = document.getElementById('time');
const hintBtn = document.getElementById('hintBtn');
const undoBtn = document.getElementById('undoBtn');
const newGameBtn = document.getElementById('newGameBtn');

// Initialize game
function initGame() {
    clearInterval(timer);
    time = 0;
    updateTime();
    timer = setInterval(updateTime, 1000);
    moveHistory = [];
    
    // Generate deck
    const suits = ['♥', '♦', '♣', '♠'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({
                suit: suit,
                value: value,
                color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                visible: false
            });
        });
    });
    
    // Shuffle deck
    deck = shuffleDeck(deck);
    
    // Setup game board
    gameBoard = Array(7).fill().map(() => []);
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';
    
    // Deal cards
    for (let i = 0; i < 7; i++) {
        const pileElement = document.createElement('div');
        pileElement.className = 'pile';
        boardElement.appendChild(pileElement);
        
        for (let j = 0; j <= i; j++) {
            const card = deck.pop();
            card.visible = (j === i); // Only top card is visible
            gameBoard[i].push(card);
            
            const cardElement = createCardElement(card, i, j);
            pileElement.appendChild(cardElement);
        }
    }
    
    updateCoins();
    showAd();
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function createCardElement(card, pileIndex, cardIndex) {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.color} ${card.visible ? '' : 'hidden'}`;
    
    if (card.visible) {
        cardElement.innerHTML = `${card.value}${card.suit}`;
    }
    
    cardElement.dataset.pile = pileIndex;
    cardElement.dataset.card = cardIndex;
    
    cardElement.addEventListener('click', () => handleCardClick(pileIndex, cardIndex));
    
    return cardElement;
}

function handleCardClick(pileIndex, cardIndex) {
    const card = gameBoard[pileIndex][cardIndex];
    if (!card.visible) return;

    if (selectedCard === null) {
        // Select card
        selectedCard = { pileIndex, cardIndex };
        highlightCard(pileIndex, cardIndex, true);
    } else {
        // Try to move card
        const fromPile = selectedCard.pileIndex;
        const fromCard = selectedCard.cardIndex;
        
        // Remove selection
        highlightCard(fromPile, fromCard, false);
        
        if (pileIndex !== fromPile) {
            // Save move to history
            moveHistory.push({
                fromPile,
                fromCard,
                toPile: pileIndex,
                movedCards: gameBoard[fromPile].slice(fromCard)
            });
            
            // Move card(s)
            const cardsToMove = gameBoard[fromPile].slice(fromCard);
            gameBoard[pileIndex] = gameBoard[pileIndex].concat(cardsToMove);
            gameBoard[fromPile] = gameBoard[fromPile].slice(0, fromCard);
            
            // Reveal next card if available
            if (gameBoard[fromPile].length > 0) {
                const lastCard = gameBoard[fromPile][gameBoard[fromPile].length - 1];
                if (!lastCard.visible) {
                    lastCard.visible = true;
                    // Save reveal to history
                    moveHistory.push({
                        revealedPile: fromPile,
                        revealedCard: gameBoard[fromPile].length - 1
                    });
                }
            }
            
            // Update display
            renderGameBoard();
            
            // Award coins
            coins += 2;
            updateCoins();
            
            // Check for win
            checkWin();
        }
        
        selectedCard = null;
    }
}

function highlightCard(pileIndex, cardIndex, highlight) {
    const selector = `.card[data-pile="${pileIndex}"][data-card="${cardIndex}"]`;
    const cardElement = document.querySelector(selector);
    if (cardElement) {
        cardElement.classList.toggle('selected', highlight);
    }
}

function renderGameBoard() {
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';
    
    for (let i = 0; i < 7; i++) {
        const pileElement = document.createElement('div');
        pileElement.className = 'pile';
        
        for (let j = 0; j < gameBoard[i].length; j++) {
            const card = gameBoard[i][j];
            const cardElement = createCardElement(card, i, j);
            pileElement.appendChild(cardElement);
        }
        
        boardElement.appendChild(pileElement);
    }
}

function updateTime() {
    time++;
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

function updateCoins() {
    coinsDisplay.textContent = coins;
}

function checkWin() {
    // Check if all cards are visible and organized
    let allVisible = true;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            if (!gameBoard[i][j].visible) {
                allVisible = false;
                break;
            }
        }
        if (!allVisible) break;
    }
    
    if (allVisible) {
        clearInterval(timer);
        const winAmount = Math.floor(5000 / (time + 1));
        coins += winAmount;
        updateCoins();
        
        // Create win animation
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            alert(`🎉 Congratulations! You won ${winAmount} coins!`);
            confetti.remove();
        }, 1000);
    }
}

// Button functions
function giveHint() {
    if (coins >= 10) {
        coins -= 10;
        updateCoins();
        
        // Find first hidden card
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                if (!gameBoard[i][j].visible) {
                    // Highlight the pile
                    const pile = document.querySelectorAll('.pile')[i];
                    pile.style.animation = 'pulse 1s 3';
                    setTimeout(() => {
                        pile.style.animation = '';
                    }, 3000);
                    return;
                }
            }
        }
        alert("All cards are already visible!");
    } else {
        alert("Not enough coins! Watch an ad to earn more.");
        showRewardedAd();
    }
}

function undoMove() {
    if (coins >= 5 && moveHistory.length > 0) {
        coins -= 5;
        updateCoins();
        
        const lastMove = moveHistory.pop();
        
        if (lastMove.revealedPile !== undefined) {
            // Undo card reveal
            gameBoard[lastMove.revealedPile][lastMove.revealedCard].visible = false;
        } else {
            // Undo card move
            const movedCards = gameBoard[lastMove.toPile].splice(-lastMove.movedCards.length);
            gameBoard[lastMove.fromPile] = gameBoard[lastMove.fromPile].concat(movedCards);
        }
        
        renderGameBoard();
    } else {
        alert(moveHistory.length === 0 ? "Nothing to undo!" : "Not enough coins!");
    }
}

// Event listeners
hintBtn.addEventListener('click', giveHint);
undoBtn.addEventListener('click', undoMove);
newGameBtn.addEventListener('click', initGame);

// Initialize game on load
window.addEventListener('DOMContentLoaded', initGame);

// Confetti animation style
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.confetti {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://media.giphy.com/media/XEg1a0Q1jOObZvqj6v/giphy.gif') center/cover;
    z-index: 1000;
    pointer-events: none;
    opacity: 0.8;
}
`;
document.head.appendChild(style);