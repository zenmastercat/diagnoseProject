const sentenceData = {
  en: [
    {
      sentence: "The quick brown fox jumps over the lazy dog",
      normal: [120, 130, 115, 122, 110, 128, 123, 119, 126, 112, 124, 117, 115, 113, 122, 125, 118, 120, 123, 124, 119, 121, 122, 124, 127, 125, 124, 123, 122, 118]
    },
    {
      sentence: "She sells seashells by the seashore",
      normal: [130, 122, 125, 132, 128, 126, 124, 127, 129, 122, 125, 124, 123, 128, 130, 126, 125, 123, 122, 120, 118, 124, 126, 125, 124, 122, 124, 123, 121, 120]
    }
  ],
  th: [
    {
      sentence: "กระต่ายกินแครอทและกระโดดผ่านต้นไม้",
      normal: [135, 128, 130, 133, 127, 129, 132, 128, 131, 125, 124, 122, 120, 118, 124, 128, 129, 127, 125, 124, 126, 124, 123, 122, 121, 125, 128, 124, 122, 120]
    },
    {
      sentence: "วันนี้อากาศดีมากเหมาะกับการเดินเล่นในสวน",
      normal: [140, 135, 130, 125, 130, 133, 128, 132, 130, 125, 128, 127, 130, 135, 129, 126, 124, 125, 123, 122, 121, 120, 124, 122, 123, 124, 127, 130, 129, 128]
    }
  ]
};

let currentLang = "en";
let currentData = null;

function pickSentence(lang) {
  const options = sentenceData[lang];
  return options[Math.floor(Math.random() * options.length)];
}

function changeLanguage() {
  currentLang = document.getElementById("language").value;

  // Update UI text
  document.getElementById("typingArea").value = "";
  document.getElementById("output").innerText = "";

  document.getElementById("instruction").innerText = currentLang === "th"
    ? "พิมพ์ประโยคต่อไปนี้:"
    : "Type the following sentence:";
  document.getElementById("analyzeBtn").innerText = currentLang === "th"
    ? "วิเคราะห์"
    : "Analyze";

  // Pick a new sentence
  currentData = pickSentence(currentLang);
  document.getElementById("targetSentence").innerText = currentData.sentence;
}

// Typing logic
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
    alert(currentLang === "th"
      ? "❌ คุณพิมพ์ไม่ตรงกับประโยค กรุณาลองใหม่อีกครั้ง"
      : "❌ Your typed sentence doesn't match the prompt exactly.");
    return;
  }

  if (timings.length < 5) {
    alert(currentLang === "th"
      ? "⚠️ กรุณาพิมพ์ประโยคให้ครบก่อนวิเคราะห์"
      : "⚠️ Please type the full sentence before analyzing.");
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
      output.innerText = `${data.result} (RMSE: ${data.rmse})`;

      if (data.result.includes("Risk") || data.result.includes("เสี่ยง")) {
        output.style.color = "red";
        alert(data.result);
      } else if (data.result.includes("deviation")) {
        output.style.color = "orange";
      } else {
        output.style.color = "green";
      }

      // Reset
      timings = [];
      lastTime = null;
      textarea.value = "";
      currentData = pickSentence(currentLang);
      document.getElementById("targetSentence").innerText = currentData.sentence;
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Something went wrong.");
    });
}

// Intro overlay control
function enterSite() {
  document.getElementById("introOverlay").style.display = "none";
  document.getElementById("mainContainer").style.display = "block";
}

// Initialize on load
window.onload = () => {
  changeLanguage();
  document.getElementById("mainContainer").style.display = "none";
  document.getElementById("introOverlay").style.display = "flex";
};