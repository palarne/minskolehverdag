else if (q.type === "scale") {

    html += `
        <h3>
            Hvor godt liker du disse fagene?
        </h3>

        <p>
            1 = liker lite, 10 = liker best
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

                <br><br>

                <input
                    type="range"
                    min="${questions[i].min}"
                    max="${questions[i].max}"
                    value="5"
                    id="scaleAnswer${i}"
                    style="width:100%;">

                <div>
                    ${questions[i].min} - ${questions[i].max}
                </div>

            </div>
        `;

        i++;
    }

}
