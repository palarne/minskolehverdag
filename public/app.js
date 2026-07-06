function showQuestion() {

    const q = questions[current];

    document.getElementById("questionNumber").innerText =
        "Spørsmål " + (current + 1) + " av " + questions.length;

    document.getElementById("questionText").innerText =
        q.text;

    let html = "";

    if (q.type === "radio") {

        q.options.forEach(function(option) {

            html += `
                <label>
                    <input type="radio"
                           name="answer"
                           value="${option}">
                    ${option}
                </label><br>
            `;
        });
    }

    else if (q.type === "checkbox") {

        q.options.forEach(function(option) {

            html += `
                <label>
                    <input type="checkbox"
                           name="answer"
                           value="${option}">
                    ${option}
                </label><br>
            `;
        });
    }

    html += `
        <br><br>
        <strong>Kommentar (valgfritt)</strong>
        <br>
        <textarea
            id="commentAnswer"
            rows="4"
            style="width:100%;"
            placeholder="Skriv kommentar her">
        </textarea>
    `;

    document.getElementById("answerArea").innerHTML =
        html;
}
