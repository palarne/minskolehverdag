const $ = id => document.getElementById(id);

let questions = [];
let current = 0;
let answers = [];

document.addEventListener("DOMContentLoaded", () => {
    $("nextBtn")?.addEventListener("click", go);
    $("startBtn")?.addEventListener("click", startSurvey);
    $("backBtn")?.addEventListener("click", previousQuestion);
    $("questionNextBtn")?.addEventListener("click", nextQuestion);
});

function show(id) {
    $(id).style.display = "block";
}

function hide(id) {
    $(id).style.display = "none";
}

function go() {

    const pid = $("pid").value.trim();

    if (!pid) {
        alert("Skriv inn deltaker-ID");
        return;
    }

    hide("start");
    show("mode");
}

async function startSurvey() {

    const selected =
        document.querySelector(
            'input[name="m"]:checked'
        );

    if (!selected) {
        alert("Velg spørreskjema");
        return;
    }

    try {

        const response =
            await fetch(
                `/data/${selected.value}.json`
            );

        questions =
            await response.json();

        current = 0;
        answers = [];

        hide("mode");
        show("questionPage");

        showQuestion();

    } catch (error) {

        console.error(error);

        alert(
            "Kunne ikke laste spørreskjemaet."
        );
    }
}

function showQuestion() {

    const q = questions[current];

    if (!q) {
        return;
    }

    $("questionNumber").innerText =
        `Spørsmål ${current + 1} av ${questions.length}`;

    $("questionText").innerText =
        q.type === "scale"
            ? ""
            : q.text;

    let html =
        renderQuestion(q);

    if (
        current <
        questions.length - 1
    ) {
        html += renderCommentField();
    }

    $("answerArea").innerHTML =
        html;
}

function renderQuestion(q) {

    switch (q.type) {

        case "radio":
            return renderRadio(q);

        case "checkbox":
            return renderCheckbox(q);

        case "text":
            return renderText();

        case "scale":
            return renderScale();

        default:
            return "";
    }
}

function renderRadio(q) {

    return q.options
        .map(option => `
            <label>
                <input
                    type="radio"
                    name="answer"
                    value="${option}">
                ${option}
            </label>
        `)
        .join("");
}

function renderCheckbox(q) {

    return q.options
        .map(option => `
            <label>
                <input
                    type="checkbox"
                    name="answer"
                    value="${option}">
                ${option}
            </label>
        `)
        .join("");
}

function renderText() {

    return `
        <textarea
            id="mainAnswer"
            rows="5"
            style="width:100%;"></textarea>
    `;
}

function renderScale() {

    let html = `
        <h3>
            Hvor godt liker du disse fagene?
        </h3>

        <p>
            1 = liker lite,
            10 = liker best
        </p>
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
                        oninput="
                            updateScaleValue(
                                ${i},
                                this.value
                            )
                        ">

                    <div
                        id="numbers${i}"
                        class="scale-numbers">

                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span class="active">
                            5
                        </span>
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

    return html;
}

function renderCommentField() {

    return `
        <br><br>

        <strong>
            Vil du si noe mer?
        </strong>

        <br>

        <textarea
            id="extraComment"
            rows="4"
            style="width:100%;"
            placeholder="
                Skriv her hvis du vil
                utdype svaret ditt
            ">
        </textarea>
    `;
}

function collectAnswer(q) {

    if (q.type === "radio") {

        const selected =
            document.querySelector(
                'input[name="answer"]:checked'
            );

        return selected
            ? selected.value
            : "";
    }

    if (q.type === "checkbox") {

        return Array.from(
            document.querySelectorAll(
                'input[name="answer"]:checked'
            )
        ).map(item => item.value);
    }

    if (q.type === "text") {

        return (
            $("mainAnswer")
                ?.value ?? ""
        );
    }

    if (q.type === "scale") {

        const values = {};

        let i = current;

        while (
            i < questions.length &&
            questions[i].type === "scale"
            ) {

            values[
                questions[i].text
                ] =
                $(`scaleAnswer${i}`)
                    ?.value ?? "";

            i++;
        }

        return values;
    }

    return "";
}

function nextQuestion() {

    const q = questions[current];

    if (!q) {
        submitSurvey();
        return;
    }

    const answer =
        collectAnswer(q);

    const comment =
        $("extraComment")
            ?.value ?? "";

    answers[current] = {
        question: q.text,
        answer,
        comment
    };

    if (q.type === "scale") {

        while (
            current <
            questions.length &&
            questions[current].type === "scale"
            ) {
            current++;
        }

    } else {

        current++;
    }

    if (
        current >=
        questions.length
    ) {
        submitSurvey();
        return;
    }

    showQuestion();
}

function previousQuestion() {

    if (
        $("questionPage")
            .style.display !== "none"
    ) {

        if (current > 0) {

            current--;
            showQuestion();

        } else {

            hide("questionPage");
            show("mode");
        }

    } else if (
        $("mode")
            .style.display !== "none"
    ) {

        hide("mode");
        show("start");
    }
}

function updateScaleValue(
    index,
    value
) {

    const numbers =
        document.querySelectorAll(
            `#numbers${index} span`
        );

    numbers.forEach(
        number =>
            number.classList.remove(
                "active"
            )
    );

    numbers[
    value - 1
        ]?.classList.add(
        "active"
    );
}

function submitSurvey() {

    const surveyData = {
        kandidatnummer:
        $("pid").value,
        tidspunkt:
            new Date().toISOString(),
        svar: answers.filter(
            Boolean
        )
    };

    const json =
        JSON.stringify(
            surveyData,
            (key, value) => {

                if (
                    value === null ||
                    value === ""
                ) {
                    return undefined;
                }

                if (
                    Array.isArray(value) &&
                    value.length === 0
                ) {
                    return undefined;
                }

                return value;
            },
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        `survey-${
            surveyData.kandidatnummer
        }.json`;

    document.body.appendChild(
        link
    );

    link.click();

    document.body.removeChild(
        link
    );

    URL.revokeObjectURL(
        link.href
    );

    hide("questionPage");
    show("done");
}
