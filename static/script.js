function submitData() {
    console.log("Sending timings:", timings);

    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: timings })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response from server:", data);
        document.getElementById("output").innerText = data.result;
        timings = [];
        lastTime = null;
    })
    .catch(err => {
        console.error("Error sending data:", err);
        alert("Something went wrong. Check console.");
    });
}
