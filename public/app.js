let pid;
let questions = [];
let index = 0;
let answers = [];

function nextStep() {
  pid = document.getElementById("pid").value;

  document.getElementById("start").style.display = "none";
  document.getElementById("choose").style.display = "block";
}

async function start(type) {
  const res = await fetch(`/api/survey/${type}`);
  questions = await res.json();

  document.getElementById("choose").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  show();
}

function show() {
  const q = questions[index];

  document.getElementById("question").innerText =
    `Spørsmål ${index + 1} av ${questions.length}`;

  let html = "";

  if (q.type === "single") {
    q.options.forEach(o => {
      html += `<label><input type="radio" name="opt" value="${o}"> ${o}</label>`;
    });
  }

  if (q.type === "multi") {
    q.options.forEach(o => {
      html += `<label><input type="checkbox" value="${o}"> ${o}</label>`;
    });
  }

  if (q.type === "text") {
    html += `<textarea id="textAnswer"></textarea>`;
  }

  document.getElementById("options").innerHTML = html;
}

function next() {
  let answer = [];

  const radios = document.querySelectorAll('input[type="radio"]:checked');
  const checks = document.querySelectorAll('input[type="checkbox"]:checked');

  if (radios.length > 0) {
    answer = radios[0].value;
  } else if (checks.length > 0) {
    answer = [...checks].map(c => c.value);
  } else {
    const text = document.getElementById("textAnswer");
    if (text) answer = text.value;
  }

  answers[index] = {
    question: questions[index].question,
    answer
  };

  index++;

  if (index >= questions.length) {
    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pid, answers })
    });

    document.getElementById("quiz").style.display = "none";
    document.getElementById("done").style.display = "block";
  } else {
    show();
  }
}

function back() {
  if (index > 0) index--;
  show();
}
