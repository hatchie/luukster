import { clearAnswers, createAnswer, setText, show, hide } from "./ui.js";

let questions = [];
let current = 0;
let total = 0;
let score = 0;
let falling = [];
let interval = null;
let answered = false;
let currentCorrect = 0;

export function loadQuestions(data) {
  questions = data;
}

export function startGame(count) {
  if (!questions.length) {
    alert("Please select a quiz first!");
    return;
  }

  total = count;
  current = 0;
  score = 0;

  hide("menu");
  show("game");

  nextQuestion();
}

export function handleKeyboardAnswer(index) {
  if (answered) return;
  const el = falling.find(a => Number(a.dataset.index) === index);
  if (el) handleAnswer(index, el);
}

function nextQuestion() {
  clearInterval(interval);
  answered = false;
  falling = [];
  clearAnswers();

  if (current >= total) {
    endGame();
    return;
  }

  const q = questions[Math.floor(Math.random() * questions.length)];
  currentCorrect = q.correctIndex;

  setText("question", q.question);
  setText("score", `Score: ${score}`);

  q.answers.forEach((text, i) => {
    falling.push(createAnswer(text, i, handleAnswer));
  });

  const speed = 0.6 + current * 0.05;

  interval = setInterval(() => {
    falling.forEach(a => {
      a.style.top = a.offsetTop + speed + "px";

      if (a.offsetTop + a.offsetHeight >= gameArea.offsetHeight - 8) {
        clearInterval(interval);
        setTimeout(() => {
          current++;
          nextQuestion();
        }, 700);
      }
    });
  }, 16);
}

function handleAnswer(index, element) {
  if (answered) return;
  answered = true;

  clearInterval(interval);

  if (index === currentCorrect) {
    score++;
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }

  setTimeout(() => {
    current++;
    nextQuestion();
  }, 700);
}

function endGame() {
  hide("game");
  show("result");
  setText("finalScore", `You scored ${score} out of ${total}`);
}
