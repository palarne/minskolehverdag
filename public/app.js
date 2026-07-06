let pid;
let mode;
let questions = [];
let current = 0;
let answers = [];

function go() {
    pid = document.getElementById("pid").value.trim();

    if (!pid) {
        alert("Skriv inn deltaker-ID");
        return;
    }

    document.getElementById("start").style.display = "none";
    document.getElementById("mode").style.display = "block";
}

function start() {
    const selected = document.querySelector('input[name="m"]:checked');

    if (!selected) {
        alert("Velg skjema");
        return;
    }

    mode = selected.value;

    fetch(`/data/${mode}.json`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            current = 0;

            document.getElementById("mode").style.display = "none";
            document.getElementById("questionPage").style.display = "block";

            showQuestion();
        })
        .catch(error => {
            console.error(error);
            alert("Fant ikke spørreskjemaet.");
        });
}

function showQuestion() {

    const q = questions[current];

    document.getElementById("questionNumber").innerText =
        `Spørsmål ${current + 1} av ${questions.length}`;

    document.getElementById("questionText").innerText = q.text;

    const answerArea = document.getElementById("answerArea");

    let html = "";

    if (q.type === "radio") {

        q.options.forEach(option => {

            html += `
                <label>
                    <input type="radio" name="answer" value="${option}">
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
                    <input type="checkbox" name="answer" value="${option}">
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
                rows="6"
                style="width:100%;"
                placeholder="Skriv svaret ditt her..."
            ></textarea>
        `;
    }

    else if (q.type === "scale") {

        html = '<div class="scale">';

        for (let i = q.min; i <= q.max; i++) {

            html += `
                <label style="margin-right:10px;">
                    <input type="radio" name="answer" value="${i}">
                    ${i}
                </label>
            `;
        }

        html += '</div>';
    }

    answerArea.innerHTML = html;

    restoreAnswer();
}

function restoreAnswer() {

    const saved = answers[current];

    if (saved === undefined) {
        return;
    }

    if (Array.isArray(saved)) {

        saved.forEach(value => {

            const checkbox = document.querySelector(
                `input[value="${value}"]`
            );

            if (checkbox) {
                checkbox.checked = true;
            }
        });

    } else {

        const textBox = document.getElementById("textAnswer");

        if (textBox) {
            textBox.value = saved;
            return;
        }

        const radio = document.querySelector(
            `input[value="${saved}"]`
        );

        if (radio) {
            radio.checked = true;
        }
    }
}

function collectAnswer() {

    const q = questions[current];

    if (q.type === "radio" || q.type === "scale") {

        const selected =
            document.querySelector('input[name="answer"]:checked');

        return selected ? selected.value : "";
    }

    if (q.type === "checkbox") {

        return Array.from(
            document.querySelectorAll('input[name="answer"]:checked')
        ).map(item => item.value);
    }

    if (q.type === "text") {

        const field = document.getElementById("textAnswer");

        return field ? field.value : "";
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
        .then(() => {

            document.getElementById("questionPage").style.display = "none";
