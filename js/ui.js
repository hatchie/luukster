export function show(id) {
  document.getElementById(id).hidden = false;
}

export function hide(id) {
  document.getElementById(id).hidden = true;
}

export function setText(id, text) {
  document.getElementById(id).innerText = text;
}

export function clearAnswers() {
  document.querySelectorAll(".answer").forEach(a => a.remove());
}

export function createAnswer(text, index, onSelect) {
  const div = document.createElement("div");
  div.className = "answer";
  div.innerText = `${String.fromCharCode(65 + index)}. ${text}`;
  div.dataset.index = index;

  div.style.left = `${5 + index * 23}%`;
  div.style.width = "22%";
  div.style.top = "-60px";

  div.onclick = () => onSelect(index, div);
  document.getElementById("gameArea").appendChild(div);

  return div;
}
