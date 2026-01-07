let cards = [];
let flipped = [];
let lock = false;

export function loadData(data) {
  // Convert pairs into individual cards
  cards = data.flatMap(pair => [
    { text: pair.a, key: pair.a + pair.b },
    { text: pair.b, key: pair.a + pair.b }
  ]);

  shuffle(cards);
}

export function start() {
  document.getElementById("menu").hidden = true;
  document.getElementById("pairs").hidden = false;

  const grid = document.getElementById("pairsGrid");
  grid.innerHTML = "";

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "pair-card";
    div.innerText = "?";

    div.onclick = () => flipCard(div, card);
    grid.appendChild(div);
  });
}

function flipCard(el, card) {
  if (lock || el.classList.contains("matched") || flipped.includes(el)) return;

  el.innerText = card.text;
  el.classList.add("revealed");
  flipped.push(el);

  if (flipped.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  lock = true;

  const [a, b] = flipped;
  const cardA = cards.find(c => c.text === a.innerText);
  const cardB = cards.find(c => c.text === b.innerText);

  if (cardA.key === cardB.key) {
    a.classList.add("matched");
    b.classList.add("matched");
    flipped = [];
    lock = false;
  } else {
    setTimeout(() => {
      a.innerText = "?";
      b.innerText = "?";
      a.classList.remove("revealed");
      b.classList.remove("revealed");
      flipped = [];
      lock = false;
    }, 800);
  }
}

document.getElementById("pairsBack").onclick = () => location.reload();

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
