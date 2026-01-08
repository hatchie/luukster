let cards = [];
let first = null;
let flipped = [];
let lock = false;
let currentMode = "blind";

export function loadData(data) {
  // Convert pairs into individual cards
  cards = data.flatMap(pair => [
    { text: pair.a, key: pair.a + pair.b },
    { text: pair.b, key: pair.a + pair.b }
  ]);

  shuffle(cards);
}

export function start(mode) {
  console.log("start pairs, cards BEFORE:", cards);
  console.log("Pairs mode:", mode); // ✅ mode exists HERE
  currentMode = mode;
  document.getElementById("menu").hidden = true;
  document.getElementById("pairs").hidden = false;

  if (mode === "preview") {
    revealAll();
    setTimeout(hideAll, 10000);
  }

  if (mode === "open") {
    revealAll(true);
  }
  renderGrid();
  console.log("start pairs, cards AFTER:", cards);
}

function renderGrid() {
  const area = document.getElementById("gameArea");
  area.innerHTML = ""; // clear previous cards

  //debug
  console.log("renderGrid called, cards:", cards);
  
  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "pair-card";

    // store card value
    div.dataset.text = card.text;

    // show or hide based on mode
    if (currentMode === "open") {
      div.innerText = card.text;
      div.classList.add("open");
    } else {
      div.innerText = "";
      div.classList.remove("open");
    }

    div.onclick = () => flipCard(div);
    area.appendChild(div);
  });

  // preview mode: show cards briefly
  if (currentMode === "preview") {
    previewCards();
  }
}

function previewCards() {
  const cardsEl = document.querySelectorAll(".pair-card");

  // Show all cards
  cardsEl.forEach(card => {
    card.innerText = card.dataset.text;
    card.classList.add("open");
  });

  lock = true; // block interaction during preview

  // After 10 seconds, hide cards again
  setTimeout(() => {
    cardsEl.forEach(card => {
      card.innerText = "";
      card.classList.remove("open");
    });

    lock = false; // allow play
  }, 10000); // 10 seconds
}

function revealAll(permanent = false) {
  document.querySelectorAll(".pair-card").forEach(card => {
    card.innerText = card.dataset.text;
    card.classList.add("revealed");
    if (permanent) card.classList.add("matched");
  });
}

function hideAll() {
  document.querySelectorAll(".pair-card").forEach(card => {
    if (!card.classList.contains("matched")) {
      card.innerText = "?";
      card.classList.remove("revealed");
    }
  });
}


function flipCard(el, card) {
  // Block interaction during preview or animation
  if (lock) return;

  // Prevent re-clicking matched or already flipped cards
  if (el.classList.contains("matched") || flipped.includes(el)) return;

  // Reveal card
  el.innerText = card.text;
  el.classList.add("revealed");

  flipped.push(el);

  // Check match when two cards are flipped
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
