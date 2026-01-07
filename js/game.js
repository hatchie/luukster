// Import UI helper functions
// These ONLY deal with DOM updates and visuals
import { clearAnswers, createAnswer, setText, show, hide } from "./ui.js";


// ================================
// GAME STATE VARIABLES
// ================================

// All loaded questions from the selected quiz JSON file
let questions = [];

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
