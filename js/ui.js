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
// Remove all answ
