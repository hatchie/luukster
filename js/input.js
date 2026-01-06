export function setupKeyboard(onAnswer) {
  document.addEventListener("keydown", (e) => {
    const map = {
      a: 0, 1: 0,
      b: 1, 2: 1,
      c: 2, 3: 2,
      d: 3, 4: 3
    };

    const index = map[e.key.toLowerCase()];
    if (index !== undefined) {
      onAnswer(index);
    }
  });
}
