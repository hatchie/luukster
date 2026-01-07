let cards = [];
let index = 0;
let showingFront = true;

export function loadData(data) {
  cards = data;
  index = 0;
}

export function start() {
  document.getElementById("menu").hidden = true;
  document.getElementById("flashcards").hidden = false;
  showCard();
}

function showCard() {
  showingFront = true;
  document.getElementById("flashText").innerText = cards[index].front;
}

document.getElementById("flashcard").onclick = () => {
  showingFront = !showingFront;
  document.getElementById("flashText").innerText =
    showingFront ? cards[index].front : cards[index].back;
};

document.getElementById("nextCard").onclick = () => {
  index = (index + 1) % cards.length;
  showCard();
};

document.getElementById("backToMenu").onclick = () => {
  location.reload(); // simple + safe for now
};
