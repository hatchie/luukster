// Import UI helper functions
// These ONLY deal with DOM updates and visuals
import { clearAnswers, createAnswer, setText, show, hide } from "./ui.js";


// ================================
// GAME STATE VARIABLES
// ================================

// All loaded questions from the selected quiz JSON file
let questions = [];

//Prevent the same question appearing twice in one game
let questionPool = [];

// Current question number (0-based index)
let current = 0;

// Total number of questions to play (e.g. 10)
let total = 0;

// Player score
let score = 0;

// Array holding the currently falling answer elements (DOM nodes)
let falling = [];

// Reference to the setInterval that moves answers downward
let interval = null;

// Prevents answering the same question multiple times
let answered = false;

// Index of the correct answer for the current question
let currentCorrect = 0;


// ================================
// LOAD QUESTIONS
// ================================
// Called from main.js after fetching a quiz JSON file
// Stores all questions in memory
export function loadQuestions(data) {
  questions = data;
}


// ================================
// START THE GAME
// ================================
// count = number of questions to play (e.g. 10)
export function startGame(count) {

  // Safety check: no quiz selected
  if (!questions.length) {
    alert("Please select a quiz first!");
    return;
  }

  // Initialize game state
  total = count;
  current = 0;
  score = 0;

// Switch from menu screen to game screen
  hide("menu");
  show("game");

  // Create a shuffled copy so no question repeats
  questionPool = shuffle([...questions]);
  // Start the first question
  nextQuestion();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shuffleAnswers(question) {
  // Combine answers with their original index
  const combined = question.answers.map((text, index) => ({
    text,
    originalIndex: index
  }));

  // Shuffle the combined array
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  // Find where the correct answer ended up
  const newCorrectIndex = combined.findIndex(
    a => a.originalIndex === question.correctIndex
  );

  return {
    answers: combined.map(a => a.text),
    correctIndex: newCorrectIndex
  };
}

// ================================
// KEYBOARD INPUT HANDLER
// ================================
// Called from input.js when user presses A–D or 1–4
export function handleKeyboardAnswer(index) {
  // Ignore input if question already answered
  if (answered) return;

  // Find the answer DOM element that matches the key pressed
  const el = falling.find(a => Number(a.dataset.index) === index);

  // If found, treat it like a click
  if (el) handleAnswer(index, el);
}


// ================================
// LOAD NEXT QUESTION
// ================================
function nextQuestion() {

  // Stop any previous falling animation
  clearInterval(interval);

  // Reset state for new question
  answered = false;
  falling = [];
   // Remove old answer elements from the DOM
  clearAnswers();

  // End game if we reached the question limit
  if (current >= total) {
    endGame();
    return;
  }

  // Pick a question from the loaded quiz
  const q = questionPool[current];

  // Shuffle answers but keep correctness intact
  const shuffled = shuffleAnswers(q);
  currentCorrect = shuffled.correctIndex;

  // Update UI text
  setText("question", q.question);
  setText("score", `Score: ${score}`);

  // Create falling answer elements
  // Each answer gets:
  // - text
  // - index (0–3)
  // - click handler (handleAnswer)
  shuffled.answers.forEach((text, i) => {
    falling.push(createAnswer(text, i, handleAnswer));
  });

  // Increase falling speed as game progresses
  const speed = 0.6 + current * 0.05;

  // Move answers downward ~60 times per second
  interval = setInterval(() => {

    falling.forEach(a => {

      // Move answer down by speed
      a.style.top = a.offsetTop + speed + "px";

      // Check if answer hits the floor
      if (a.offsetTop + a.offsetHeight >= gameArea.offsetHeight - 8) {

        // Stop falling
        clearInterval(interval);
        // Automatically go to next question
        setTimeout(() => {
          current++;
          nextQuestion();
        }, 700);
      }
    });

  }, 16); // ~60 FPS
}


// ================================
// HANDLE ANSWER SELECTION
// ================================
// index   → selected answer index (0–3)
// element → clicked DOM element
function handleAnswer(index, element) {
  // Prevent multiple selections
  if (answered) return;
  answered = true;

  // Stop falling animation
  clearInterval(interval);

  // Check correctness
  if (index === currentCorrect) {
    score++;
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }

  // Short delay before next question
  setTimeout(() => {
    current++;
    nextQuestion();
  }, 700);
  }


// ================================
// END GAME
// ================================
function endGame() {

  // Hide game screen
  hide("game");

  // Show result screen
  show("result");

  // Display final score
  setText("finalScore", `You scored ${score} out of ${total}`);
}


