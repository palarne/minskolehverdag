let questions = [];
let current = 0;

document.addEventListener("DOMContentLoaded", function () {

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

    const pid =
        document.getElementById("pid").value.trim();

    if (!pid) {
        alert("Skriv inn deltaker-ID");
        return;
    }

    document.getElementById("start").style.display =
        "none";

    document.getElementById("mode").style.display =
        "block";
}

function startSurvey() {

    const selected =
        document.querySelector(
            'input[name="m"]:checked'
        );

    if (!selected) {
        alert("Velg spørreskjema");
        return;
    }

    const mode = selected.value;

    fetch("/data/" + mode + ".json")
        .then(response => response.json())
        .then(data => {

            questions = data;
            current = 0;

            document.getElementById("mode")
                .style.display = "none";

            document.getElementById("questionPage")
                .style.display = "block";

            showQuestion();
        })
        .catch(error => {

            console.error(error);

            alert(
                "JSON-feil: " + error.message
            );
        });
}

function showQuestion() {

    const q = questions[current];

    document.getElementById("questionNumber")
        .innerText =
        "Spørsmål " +
        (current + 1) +
        " av " +
        questions.length;

    document.getElementById("questionText")
        .innerText =
        q.text;

    let html = "";

    if (q.type === "radio") {

        q.options.forEach(function(option) {

            html += `
                <label>
                    <input
                        type="radio"
                        name="answer"
                        value="${option}">
                    ${option}
                </label>
                <br>
            `;
        });
    }

    else if (q.type === "checkbox") {

        q.options.forEach(function(option) {

            html += `
                <label>
                    <input
                        type="checkbox"
                        name="answer"
                        value="${option}">
                    ${option}
