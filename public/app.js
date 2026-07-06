console.log("app.js lastet");

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("nextBtn")
        .addEventListener("click", () => {

            const pid =
                document.getElementById("pid").value.trim();

            if (!pid) {
                alert("Skriv inn deltaker-ID");
                return;
            }

            document.getElementById("start").style.display = "none";
            document.getElementById("mode").style.display = "block";
        });

});
