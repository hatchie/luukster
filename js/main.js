import { loadQuestions, startGame, handleKeyboardAnswer } from "./game.js";
import { setupKeyboard } from "./input.js";

fetch("./data/questions.json")
  .then(res => res.json())
  .then(data => loadQuestions(data));

document.getElementById("btn5").onclick = () => startGame(5);
document.getElementById("btn10").onclick = () => startGame(10);

setupKeyboard(handleKeyboardAnswer);
