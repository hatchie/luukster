import { loadQuestions, startGame, handleKeyboardAnswer } from "./game.js";
import { setupKeyboard } from "./input.js";
import { setText } from "./ui.js";

let selectedQuizFile = null;

// Load quiz list
fetch("./data/quizzes.json")
  .then(res => res.json())
  .then(quizzes => {
    const list = document.getElementById("quizList");

    quizzes.forEach(q => {
      const btn = document.createElement("button");
      btn.textContent = q.title;

      btn.onclick = async () => {
        selectedQuizFile = q.file;

        const res = await fetch(`./data/${q.file}`);
        const data = await res.json();
        loadQuestions(data);

        document.querySelectorAll("#quizList button")
          .forEach(b => b.style.opacity = 0.5);

        btn.style.opacity = 1;
      };

      list.appendChild(btn);
    });
  });

document.getElementById("btn5").onclick = () => {
  if (selectedQuizFile) startGame(5);
};

document.getElementById("btn10").onclick = () => {
  if (selectedQuizFile) startGame(10);
};

setupKeyboard(handleKeyboardAnswer);
