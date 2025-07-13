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
    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: timings })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("output").innerText = data.result;
        timings = [];
        lastTime = null;
    });
}