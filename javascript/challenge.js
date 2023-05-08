const problem = document.getElementById("problem");
const answer = document.getElementById("answer");
const submit = document.getElementById("submit");

function generateProblem() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  problem.textContent = `${a} + ${b} =`;
  return a + b;
}

let correctAnswer = generateProblem();

submit.addEventListener("click", () => {
  if (parseInt(answer.value, 10) === correctAnswer) {
    window.close();
  } else {
    answer.value = "";
    correctAnswer = generateProblem();
  }
});
