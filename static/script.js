const sentences = [
  { text: "The doctor asked the patient to raise both arms.", normalTime: 4.5 },
  { text: "Please type this sentence as quickly as you can.", normalTime: 5.0 },
  { text: "I can smell the rain before it even begins to fall.", normalTime: 4.2 },
  { text: "การพิมพ์ข้อความนี้ให้รวดเร็วและถูกต้อง", normalTime: 6.5 }, // Thai
  { text: "วันนี้อากาศดีมาก อย่าลืมออกกำลังกาย", normalTime: 6.0 } // Thai
];

let selected = sentences[Math.floor(Math.random() * sentences.length)];
document.getElementById("prompt").innerText = selected.text;

let startTime = Date.now();

function analyze() {
  const input = document.getElementById("userInput").value.trim();
  const output = document.getElementById("output");

  if (input !== selected.text) {
    output.innerText = "❌ Incorrect typing. Please try again.";
    return;
  }

  let duration = (Date.now() - startTime) / 1000; // seconds
  let features = Array(30).fill(duration); // simulated features

  fetch("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features })
  })
  .then(res => res.json())
  .then(data => {
    output.innerText = `✅ Result: ${data.result}`;
  })
  .catch(err => {
    output.innerText = "⚠️ Error contacting server.";
    console.error(err);
  });
}
