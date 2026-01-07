// ================================
// UI HELPER FUNCTIONS
// ================================
// This file ONLY handles DOM / visual updates.
// No game logic lives here.
// game.js calls these functions to update the screen.
// ================================


// -------------------------------
// Show a screen or element
// -------------------------------
// Example: show("game")
// This sets hidden = false so the element becomes visible
export function show(id) {
  document.getElementById(id).hidden = false;
}


// -------------------------------
// Hide a screen or element
// -------------------------------
// Example: hide("menu")
// This sets hidden = true so the element is not visible
export function hide(id) {
  document.getElementById(id).hidden = true;
}


// -------------------------------
// Set text content of an element
// -------------------------------
// Example: setText("score", "Score: 3")
// This safely updates visible text on the page
export function setText(id, text) {
  document.getElementById(id).innerText = text;
}


// -------------------------------
// Remove all answer elements
// -------------------------------
// Called before showing a new question
// Prevents answers from previous questions from staying on screen
export function clearAnswers() {
  document.querySelectorAll(".answer").forEach(a => a.remove());
}


// -------------------------------
// Create a falling answer option
// -------------------------------
// text     → answer text (e.g. "Goodbye")
// index    → 0, 1, 2, or 3 (used for A/B/C/D)
// onSelect → callback function when answer is clicked
//
// This function:
// 1. Creates a new DIV
// 2. Styles and positions it
// 3. Labels it with A/B/C/D
// 4. Adds click handling
// 5. Adds it to the game area
// 6. Returns the element so game.js can animate it
export function createAnswer(text, index, onSelect) {

  // Create a new div for the answer
  const div = document.createElement("div");

  // Apply CSS class used for styling and animation
  div.className = "answer";

  // Convert index → letter (0=A, 1=B, 2=C, 3=D)
  // Example: "A. Goodbye"
  div.innerText = `${String.fromCharCode(65 + index)}. ${text}`;

  // Store the index so keyboard input can find this answer later
  div.dataset.index = index;

  // Horizontal position:
  // 5% margin + spaced evenly across the width
  div.style.left = `${5 + index * 23}%`;

  // Fixed width so answers align nicely
  div.style.width = "22%";
  // Start above the screen so it can "fall down"
  div.style.top = "-60px";

  // When clicked or tapped, notify game.js
  div.onclick = () => onSelect(index, div);

  // Add the answer element to the game area
  document.getElementById("gameArea").appendChild(div);

  // Return the element so game.js can move it downward
  return div;
}
