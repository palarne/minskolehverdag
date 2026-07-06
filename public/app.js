let questions = [];
let current = 0;
let answers = [];
let pid = "";
let mode = "";

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("nextBtn")
    .addEventListener("click", go);

  document.getElementById("startBtn")
    .addEventListener("click", startSurvey);

  document.getElementById("backBtn")
    .addEventListener("click", previousQuestion);

  document.getElementById("questionNextBtn")
    .addEventListener("click", nextQuestion);

});

function go() {

  pid = document.getElementById("pid").value.trim();

  if (!pid) {
    alert("Skriv inn deltaker-ID");
    return;
  }

  document.getElementById("start").style.display = "none";
  document.getElementById("mode").style.display = "block";
}

function startSurvey() {

  const selected =
    document.querySelector("input[name='m']:checked");

  if (!selected) {
    alert("Velg Med karakterer eller Uten karakterer");
    return;
  }

  mode = selected.value;

  fetch(`/data/${mode}.json`)
    .then(response => response.json())
    .then(data => {

      questions = data;
      current = 0;
      answers = [];

      document.getElementById("mode").style.display = "none";
      document.getElementById("questionPage").style.display = "block";

      showQuestion();

    })
    .catch(error => {
      console.error(error);
      alert("Fant ikke spørreskjema");
    });
}

function showQuestion() {

  const q = questions[current];

  document.getElementById("questionNumber").textContent =
    `Spørsmål ${current + 1} av ${questions.length}`;

  document.getElementById("questionText").textContent =
    q.text;

  let html = "";

  if (q.type === "radio") {

    q.options.forEach(option => {

      html += `
        <label>
          <input type="radio"
                 name="answer"
                 value="${option}">
          ${option}
        </label>
        <br>
      `;
    });
  }

  else if (q.type === "checkbox") {

    q.options.forEach(option => {

      html += `
        <label>
          <input type="checkbox"
                 name="answer"
                 value="${option}">
          ${option}
        </label>
        <br>
      `;
    });
  }

  else if (q.type === "text") {

    html = `
      <textarea
        id="textAnswer"
        rows="5"
        style="width:100%">
      </textarea>
    `;
  }

  else if (q.type === "scale") {

    for (let i = q.min; i <= q.max; i++) {

      html += `
        <label style="margin-right:10px">
          <input type="radio"
                 name="answer"
                 value="${i}">
          ${i}
        </label>
      `;
    }
  }

  document.getElementById("answerArea")
    .innerHTML = html;
}

function nextQuestion() {

  answers[current] = getAnswer();

  current++;

  if (current >= questions.length) {

    fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        participantId: pid,
        mode: mode,
        answers: answers
      })
    })
    .then(() => {

      document.getElementById("questionPage")
        .style.display = "none";

      document.getElementById("done")
        .style.display = "block";
    });

    return;
  }

  showQuestion();
}

function previousQuestion() {

  if (current > 0) {

    current--;

    showQuestion();
  }
}

function getAnswer() {

  const q = questions[current];

  if (q.type === "radio" || q.type === "scale") {

    const selected =
      document.querySelector(
        "input[name='answer']:checked"
      );

    return selected ? selected.value : "";
  }

  if (q.type === "checkbox") {

    return [...document.querySelectorAll(
      "input[name='answer']:checked"
    )].map(x => x.value);
  }

  if (q.type === "text") {

    const text =
      document.getElementById("textAnswer");

    return text ? text.value : "";
  }

  return "";
}
