const sentenceData = [
  {
    sentence: "The quick brown fox jumps over the lazy dog.",
    normal: [120, 130, 115, 122, 110, 128, 123, 119, 126, 112, 124, 117, 115, 113, 122, 125, 118, 120, 123, 124, 119, 121, 122, 124, 127, 125, 124, 123, 122, 118]
  },
  {
    sentence: "She sells seashells by the seashore.",
    normal: [130, 122, 125, 132, 128, 126, 124, 127, 129, 122, 125, 124, 123, 128, 130, 126, 125, 123, 122, 120, 118, 124, 126, 125, 124, 122, 124, 123, 121, 120]
  },
  {
    sentence: "Typing speed and accuracy can reveal health.",
    normal: [135, 128, 130, 133, 127, 129, 132, 128, 131, 125, 124, 122, 120, 118, 124, 128, 129, 127, 125, 124, 126, 124, 123, 122, 121, 125, 128, 124, 122, 120]
  }
];

let currentData = sentenceData[Math.floor(Math.random() * sentenceData.length)];
document.getElementById("targetSentence").innerText = currentData.sentence;

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
    if (typed !== currentData.sentence.trim()) {
        alert("❌ Your typed sentence doesn't match the prompt exactly.");
        return;
    }

    if (timings.length < 5) {
        alert("⚠️ Please type the full sentence before analyzing.");
        return;
    }

    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            features: timings,
            baseline: currentData.normal
        })
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



        // Reset for next sentence
        timings = [];
        lastTime = null;
        textarea.value = "";
        currentData = sentenceData[Math.floor(Math.random() * sentenceData.length)];
        document.getElementById("targetSentence").innerText = currentData.sentence;
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
    });
}
