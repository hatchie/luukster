// pairs.js
// Match Pairs game logic with 3 modes:
// - blind   : cards start hidden
// - preview : cards open for 10s, then close
// - open    : cards always visible

import { show, hide } from "../ui.js";

/* =========================
   STATE VARIABLES
========================= */

let pairData = [];     // raw data loaded from JSON
let cards = [];        // duplicated + shuffled cards
let flipped = [];      // currently flipped cards
let lock = false;      // prevents clicking during animations
let currentMode = "blind";

/* =========================
   DATA LOADING
========================= */

// Called from main.js after fetching JSON
export function loadPairs(data) {
  pairData = data;
}

/* =========================
   GAME START
========================= */

export function start(mode) {
  console.log("Pairs mode:", mode);

  currentMode = mode;
  flipped = [];
  lock = false;

  // Create duplicated + shuffled cards
  cards = shuffle(createPairs());

  hide("menu");
  show("game");

  renderGrid();
}

/* =========================
   CREATE CARD PAIRS
========================= */

function createPairs() {
  const result = [];

  pairData.forEach((item, index) => {
    // each item appears twice
    result.push({ text: item.text, id: index });
    result.push({ text: item.text, id: index });
  });

  return result; // ❗ REQUIRED
}

/* =========================
   RENDER GRID
========================= */

function renderGrid() {
  const area = document.getElementById("gameArea");
  area.innerHTML = ""; // clear previous game

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "pair-card";

    // store value on element
    div.dataset.id = card.id;
    div.dataset.text = card.text;

    // OPEN MODE → cards always visible
    if (currentMode === "open") {
      div.innerText = card.text;
      div.classList.add("revealed");
    }

    // click handler
    div.onclick = () => flipCard(div, card);

    area.appendChild(div);
  });

  // PREVIEW MODE → show cards briefly
  if (currentMode === "preview") {
    previewCards();
  }
}

/* =========================
   PREVIEW MODE
========================= */

function previewCards() {
  const allCards = document.querySelectorAll(".pair-card");

  lock = true;

  // show all cards
  allCards.forEach(c => {
    c.innerText = c.dataset.text;
    c.classList.add("revealed");
  });

  // hide after 10 seconds
  setTimeout(() => {
    allCards.forEach(c => {
      c.innerText = "";
      c.classList.remove("revealed");
    });
    lock = false;
  }, 10000);
}

/* =========================
   CARD FLIP LOGIC
========================= */

function flipCard(el, card) {
  if (lock) return;
  if (el.classList.contains("matched")) return;
  if (flipped.includes(el)) return;

  el.innerText = card.text;
  el.classList.add("revealed");
  flipped.push(el);

  if (flipped.length === 2) {
    checkMatch();
  }
}

/* =========================
   MATCH CHECK
========================= */

function checkMatch() {
  lock = true;

  const [a, b] = flipped;

  if (a.dataset.id === b.dataset.id) {
    // MATCH
    a.classList.add("matched");
    b.classList.add("matched");
    flipped = [];
    lock = false;
    checkWin();
  } else {
    // NO MATCH
    setTimeout(() => {
      a.innerText = "";
      b.innerText = "";
      a.classList.remove("revealed");
      b.classList.remove("revealed");
      flipped = [];
      lock = false;
    }, 800);
  }
}

/* =========================
   WIN CHECK
========================= */

function checkWin() {
  const remaining = document.querySelectorAll(".pair-card:not(.matched)");
  if (remaining.length === 0) {
    alert("🎉 You matched all pairs!");
  }
}

/* =========================
   SHUFFLE (Fisher–Yates)
========================= */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
