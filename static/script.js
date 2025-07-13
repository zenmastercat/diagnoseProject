let sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "She sells seashells by the seashore.",
    "Typing speed and accuracy can reveal health.",
    "A watched pot never boils.",
    "Early detection saves lives."
];

let target = sentences[Math.floor(Math.random() * sentences.length)];
document.getElementById("targetSentence").innerText = target;

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
    const typed = textarea.value.trim();
    if (typed !== target.trim()) {
        alert("❌ Your typed sentence doesn't match the prompt exactly.\nPlease try again.");
        return;
    }

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

        // Reset
        timings = [];
        lastTime = null;
        textarea.value = "";
        target = sentences[Math.floor(Math.random() * sentences.length)];
        document.getElementById("targetSentence").innerText = target;
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
    });
}
