let questions = [];
let current = 0;
let answers = [];

document.addEventListener("DOMContentLoaded", () => {

    const nextBtn = document.getElementById("nextBtn");
    const startBtn = document.getElementById("startBtn");
    const backBtn = document.getElementById("backBtn");
    const questionNextBtn =
        document.getElementById("questionNextBtn");

    if (nextBtn) {
        nextBtn.addEventListener("click", go);
    }

    if (startBtn) {
        startBtn.addEventListener("click", startSurvey);
    }

    if (backBtn) {
        backBtn.addEventListener("click", previousQuestion);
    }

    if (questionNextBtn) {
        questionNextBtn.addEventListener("click", nextQuestion);
    }

});
