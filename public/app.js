let pid = "";
let mode = "";
let questions = [];
let current = 0;
let answers = [];

function go() {
    pid = document.getElementById("pid").value.trim();

    if (pid === "") {
        alert("Skriv inn deltaker-ID");
        return;
    }

    document.getElementById("start").style.display = "none";
    document.getElementById("mode").style.display = "block";
}

function start() {

    const selected =
        document.querySelector('input[name="m"]:checked');

    if (!selected) {
        alert("Velg Med karakterer eller Uten karakterer");
        return;
    }

    mode = selected.value;

    fetch("/data/" + mode + ".json")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            questions = data;
            current = 0;
            answers = [];

            document.getElementById("mode").style.display = "none";
            document.getElementById("questionPage").style.display = "block";

            showQuestion();
        })
        .catch(function(error) {
            console.log(error);
            alert("Kunne ikke laste spørsmålene.");
        });
}

function showQuestion() {

    const q = questions[current];

    document.getElementById("questionNumber").innerText =
        "Spørsmål " +
        (current + 1) +
        " av " +
        questions.length;

    document.getElementById("questionText").innerText =
        q.text;

    let html = "";

    if (q.type === "radio") {

        q.options.forEach(function(option) {

            html +=
                '<label>' +
                '<input type="radio" name="answer" value="' +
                option +
                '"> ' +
                option +
                '</label><br>';
        });
    }

    else if (q.type === "checkbox") {

        q.options.forEach(function(option) {

            html +=
                '<label>' +
                '<input type="checkbox" name="answer" value="' +
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

    else if (q.type === "scale") {

        for (let i = q.min; i <= q.max; i++) {

            html +=
                '<label style="margin-right:10px;">' +
                '<input type="radio" name="answer" value="' +
                i +
                '"> ' +
                i +
                '</label>';
        }
    }

    document.getElementById("answerArea").innerHTML = html;
}

function collectAnswer() {

    const q = questions[current];

    if (q.type === "radio" || q.type === "scale") {

        const selected =
            document.querySelector(
                'input[name="answer"]:checked'
            );

        if (selected) {
            return selected.value;
        }

        return "";
    }

    if (q.type === "checkbox") {

        return Array.from(
            document.querySelectorAll(
                'input[name="answer"]:checked'
            )
        ).map(function(item) {
            return item.value;
        });
    }

    if (q.type === "text") {

        const field =
            document.getElementById("textAnswer");

        if (field) {
            return field.value;
        }
    }

    return "";
}

function next() {

    answers[current] = collectAnswer();

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
        .then(function() {

            document.getElementById("questionPage").style.display = "none";

            document.getElementById("done").style.display = "block";
        });

        return;
    }

    showQuestion();
}

function back() {

    if (current > 0) {
        current--;
        showQuestion();
    }
}
