let questions = [];
let current = 0;
let answers = [];
let pid = "";
let mode = "";

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
        document.querySelector('input[name="m"]:checked');

    if (!selected) {
        alert("Velg et spørreskjema");
        return;
    }

    mode = selected.value;

    fetch("/data/" + mode + ".json")
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

            alert("Feil i JSON-filen");
        });
}

function showQuestion() {

    const q = questions[current];

    document.getElementById("questionNumber").innerText =
        "Spørsmål " + (current + 1) + " av " + questions.length;

    document.getElementById("questionText").innerText =
        q.text;

    let html = "";

    if (q.type === "radio") {

        q.options.forEach(function (option) {

            html +=
                '<label><input type="radio" name="answer" value="' +
                option +
                '"> ' +
                option +
                '</label><br>';
        });
    }

    else if (q.type === "checkbox") {

        q.options.forEach(function (option) {

            html +=
                '<label><input type="checkbox" name="answer" value="' +
                option +
                '"> ' +
                option +
                '</label><br>';
        });
    }

    else if (q.type === "text") {

        html =
            '<textarea id="textAnswer" rows="5" style="width:100%;"></textarea>';
    }

    document.getElementById("answerArea").innerHTML =
        html;
}

function getAnswer() {

    const q = questions[current];

    if (q.type === "radio") {

        const selected =
            document.querySelector(
                'input[name="answer"]:checked'
            );

        return selected ? selected.value : "";
    }

    if (q.type === "checkbox") {

        return Array.from(
            document.querySelectorAll(
                'input[name="answer"]:checked'
            )
        ).map(function (item) {
            return item.value;
        });
    }

    if (q.type === "text") {

        const field =
            document.getElementById("textAnswer");

        return field ? field.value : "";
    }

    return "";
}

function nextQuestion() {

    answers[current] = getAnswer();

    current++;

    if (current >= questions.length) {

        document.getElementById("questionPage")
            .style.display = "none";

        document.getElementById("done")
            .style.display = "block";

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
