// Import functions from other modules

// loadQuestions → loads and prepares quiz questions
// startGame     → starts the game loop with X questions
// handleKeyboardAnswer → processes keyboard input (A–D / 1–4)
import { loadQuestions, startGame, handleKeyboardAnswer, stopGame } from "./game.js";

// setupKeyboard → listens for keyboard presses and maps them to answers
import { setupKeyboard } from "./input.js";

// setText → helper to change text content of elements (not used here yet)
import { setText } from "./ui.js";

//Enable Flashcards button, import flashcards
import * as Flashcards from "./games/flashcards.js";

//Enable Match Pairs, import match pairs
import * as Pairs from "./games/pairs.js";

//Add different match pair game modes and topics
let selectedPairsMode = null;
let selectedPairsTopic = null;


//Stores which game category is selected
let selectedGameType = null;

// Stores which quiz the player has selected
// If this is null, no quiz is selected yet
let selectedQuizFile = null;

// Handle game type selection
document.querySelectorAll("#gameTypeMenu button[data-type]").forEach(btn => {
  btn.onclick = () => {
    selectedGameType = btn.dataset.type;

if (selectedGameType === "quiz") {
  document.getElementById("gameTypeMenu").hidden = true;
  document.getElementById("quizMenu").hidden = false;
}

if (selectedGameType === "flashcards") {
  fetch("./data/flashcards/french.json")
    .then(res => res.json())
    .then(data => {
      Flashcards.loadData(data);
      Flashcards.start();
    });
 }

if (selectedGameType === "pairs") {
  document.getElementById("gameTypeMenu").hidden = true;
  document.getElementById("pairsModeMenu").hidden = false;
}

    
  };
});


// ================================
// LOAD QUIZ LIST (MAIN MENU)
// ================================

// Fetch the list of available quizzes from quizzes.json
fetch("./data/quizzes.json")
  .then(res => res.json())
  .then(quizzes => {

    // Get the container where quiz buttons will be placed
    const list = document.getElementById("quizList");

    // Loop through each quiz entry
    quizzes.forEach(q => {

      // Create a button for the quiz
      const btn = document.createElement("button");

      // Show the quiz title on the button (e.g. "French Basics")
      btn.textContent = q.title;

      // What happens when the player clicks a quiz
      btn.onclick = async () => {

        // Remember which quiz file is selected
        selectedQuizFile = q.file;

        // Load the quiz questions file
        const res = await fetch(`./data/${q.file}`);
        const data = await res.json();

        // Send quiz data to the game logic
        loadQuestions(data);

        // Visually fade out all quiz buttons
        document.querySelectorAll("#quizList button")
          .forEach(b => b.style.opacity = 0.5);

        // Highlight the selected quiz
        btn.style.opacity = 1;
      };

      // Add the quiz button to the menu
      list.appendChild(btn);
    });
  });

// Start game with 10 questions
document.getElementById("btn10").onclick = () => {

  // Only start if a quiz has been selected
  if (selectedQuizFile) {
    startGame(10);
  }
};

document.getElementById("quizBack").onclick = () => {
  stopGame();
  // Hide quiz UI
  document.getElementById("game").hidden = true;
  document.getElementById("result").hidden = true;
  // Reset menus
  document.getElementById("quizMenu").hidden = true;
  document.getElementById("gameTypeMenu").hidden = false;
   // Optional: reset quiz selection visuals
  document.querySelectorAll("#quizList button")
    .forEach(b => b.style.opacity = 1);
};

document.querySelectorAll("#pairsModeMenu button[data-mode]").forEach(btn => {
  btn.onclick = () => {
    selectedPairsMode = btn.dataset.mode;

    document.getElementById("pairsModeMenu").hidden = true;
    document.getElementById("pairsTopicMenu").hidden = false;

    loadPairsTopics();
  };
});

function loadPairsTopics() {
  fetch("./data/pairs/topics.json")
    .then(res => res.json())
    .then(topics => {
      const list = document.getElementById("pairsTopicList");
      list.innerHTML = "";

      topics.forEach(t => {
        const btn = document.createElement("button");
        btn.textContent = t.title;

        btn.onclick = () => {
          selectedPairsTopic = t.file;
          startPairsGame();
        };

        list.appendChild(btn);
      });
    });
}

function startPairsGame() {
  fetch(`./data/pairs/${selectedPairsTopic}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("pairsTopicMenu").hidden = true;

      Pairs.loadData(data);
      Pairs.start(selectedPairsMode); // 👈 pass mode
    });
}


// ================================
// KEYBOARD INPUT SETUP
// ===========================
setupKeyboard(handleKeyboardAnswer);








