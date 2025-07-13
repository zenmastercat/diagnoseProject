let timings = [];
let lastTime = null;

const textarea = document.getElementById("typingArea");
textarea.addEventListener("keydown", (event) => {
    const currentTime = performance.now();
    if (lastTime !== null) {
        timings.push(currentTime - lastTime);
    }
    lastTime = currentTime;
});

function submitData() {
    if (timings.length < 5) {
        alert("⚠️ Please type the full sentence before analyzing.");
        return;
    }

    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: timings })
    })
    .then(res => res.json())
    .then(data => {
        const output = document.getElementById("output");
        output.innerText = data.result;

        if (data.result.includes("Risk")) {
            output.style.color = "red";
            alert("⚠️ AI Prediction: You may be at risk. Please consult a neurologist.");
        } else {
            output.style.color = "green";
        }

        // Reset for next try
        timings = [];
        lastTime = null;
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
    });
}
