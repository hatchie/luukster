// Import functions from other modules

// loadQuestions → loads and prepares quiz questions
// startGame     → starts the game loop with X questions
// handleKeyboardAnswer → processes keyboard input (A–D / 1–4)
import { loadQuestions, startGame, handleKeyboardAnswer } from "./game.js";

// setupKeyboard → listens for keyboard presses and maps them to answers
import { setupKeyboard } from "./input.js";

// setText → helper to change text content of elements (not used here yet)
import { setText } from "./ui.js";


// Stores which quiz the player has selected
// If this is null, no quiz is selected yet
let selectedQuizFile = null;


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


// ================================
// START GAME BUTTONS
// ================================

// Optional 5-question mode (currently disabled)
// Uncomment if you want to use it later

// document.getElementById("btn5").onclick = () => {
//   if (selectedQuizFile) startGame(5);
// };


// Start game with 10 questions
document.getElementById("btn10").onclick = () => {

  // Only start if a quiz has been selected
  if (selectedQuizFile) {
    startGame(10);
  }
};


// ================================
// KEYBOARD INPUT SETUP
// ===========================
setupKeyboard(handleKeyboardAnswer);

