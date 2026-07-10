let questions = [];
let current = 0;
let answers = [];

document.addEventListener("DOMContentLoaded", () => {

    const nextBtn = document.getElementById("nextBtn");
    const startBtn = document.getElementById("startBtn");
    const backBtn = document.getElementById("backBtn");
    const questionNextBtn = document.getElementById("questionNextBtn");

    if (nextBtn) nextBtn.addEventListener("click", go);
    if (startBtn) startBtn.addEventListener("click", startSurvey);
    if (backBtn) backBtn.addEventListener("click", previousQuestion);
    if (questionNextBtn) questionNextBtn.addEventListener("click", nextQuestion);

});

function go() {

    const pid = document.getElementById("pid").value.trim();

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
        alert("Velg spørreskjema");
        return;
    }

    const mode = selected.value;

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
            alert("Kunne ikke laste spørreskjemaet.");

        });
}

function showQuestion() {
    console.log(
        "Showing question",
        current + 1,
        "of",
        questions.length
    );

    const q = questions[current];

    document.getElementById("questionNumber").innerText =
        `Spørsmål ${current + 1} av ${questions.length}`;

    document.getElementById("questionText").innerText =
        q.type === "scale" ? "" : q.text;

    let html = "";

    if (q.type === "radio") {

        q.options.forEach(option => {

            html += `
                <label>
                    <input
                        type="radio"
                        name="answer"
                        value="${option}">
                    ${option}
                </label>
            `;
        });

    } else if (q.type === "checkbox") {

        q.options.forEach(option => {

            html += `
                <label>
                    <input
                        type="checkbox"
                        name="answer"
                        value="${option}">
                    ${option}
                </label>
            `;
        });

    } else if (q.type === "text") {

        html += `
            <textarea
                id="mainAnswer"
                rows="5"
                style="width:100%;"></textarea>
        `;

    } else if (q.type === "scale") {

        html += `
            <h3>Hvor godt liker du disse fagene?</h3>
            <p>1 = liker lite, 10 = liker best</p>
        `;

        let i = current;

        while (
            i < questions.length &&
            questions[i].type === "scale"
            ) {

            html += `
                <div style="margin-bottom:25px;">

                    <strong>
                        ${questions[i].text}
                    </strong>

                    <div class="scale-wrapper">

                        <input
                            type="range"
                            min="${questions[i].min}"
                            max="${questions[i].max}"
                            value="5"
                            id="scaleAnswer${i}"
                            class="scale-slider"
                            oninput="updateScaleValue(${i}, this.value)">

                        <div id="numbers${i}" class="scale-numbers">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span class="active">5</span>
                            <span>6</span>
                            <span>7</span>
                            <span>8</span>
                            <span>9</span>
                            <span>10</span>
                        </div>

                    </div>

                </div>
            `;

            i++;
        }
    }

    if (current !== 37) {

        html += `
            <br><br>

            <strong>Vil du si noe mer?</strong>

            <br>

            <textarea
                id="extraComment"
                rows="4"
                style="width:100%;"
                placeholder="Skriv her hvis du vil utdype svaret ditt"></textarea>
        `;
    }

    document.getElementById("answerArea").innerHTML = html;
}


function nextQuestion() {

    const q = questions[current];

    let answer = "";

    if (q.type === "radio") {

        const selected =
            document.querySelector(
                'input[name="answer"]:checked'
            );

        answer = selected ? selected.value : "";

    } else if (q.type === "checkbox") {

        answer = [];

        document
            .querySelectorAll(
                'input[name="answer"]:checked'
            )
            .forEach(item => {

                answer.push(item.value);

            });

    } else if (q.type === "text") {

        const text =
            document.getElementById("mainAnswer");

        answer = text ? text.value : "";

    } else if (q.type === "scale") {

        answer = {};

        let i = current;

        while (
            i < questions.length &&
            questions[i].type === "scale"
            ) {

            const slider =
                document.getElementById(
                    `scaleAnswer${i}`
                );

            answer[questions[i].text] =
                slider ? slider.value : "";

            i++;
        }
    }

    const comment =
        document.getElementById("extraComment")
            ? document.getElementById("extraComment").value
            : "";

    answers.push({
        question: q.text,
        answer: answer,
        comment: comment
    });

    if (q.type === "scale") {

        while (
            current < questions.length &&
            questions[current].type === "scale"
            ) {
            current++;
        }

    } else {

        current++;
    }

    console.log("current =", current);
    console.log("questions.length =", questions.length);
    console.log("question type =", q.type);

    if (current >= questions.length) {
        console.log("SUBMITTING");
        fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                kandidatnummer: document.getElementById("pid").value,
                tidspunkt: new Date().toISOString(),
                svar: answers
            })
        })
            .then(response => response.json())
            .then(data => {

                console.log("Svar sendt til server:", data);

                document.getElementById("questionPage").style.display = "none";
                document.getElementById("done").style.display = "block";

            })
            .catch(error => {

                console.error("Feil ved lagring:", error);

                alert("Kunne ikke lagre svarene.");

            });

        return;
    }

    showQuestion();
}

function previousQuestion() {

    if (
        document.getElementById("questionPage").style.display !== "none"
    ) {

        if (current > 0) {

            current--;
            showQuestion();

        } else {

            document.getElementById("questionPage").style.display = "none";
            document.getElementById("mode").style.display = "block";

        }

    } else if (
        document.getElementById("mode").style.display !== "none"
    ) {

        document.getElementById("mode").style.display = "none";
        document.getElementById("start").style.display = "block";

    }
}

function updateScaleValue(index, value) {

    const numbers = document.querySelectorAll(
        `#numbers${index} span`
    );

    numbers.forEach(number => {
        number.classList.remove("active");
    });

    numbers[value - 1].classList.add("active");
}
