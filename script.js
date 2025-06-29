
function showApiReady() {
  const apiKey = document.getElementById("apiKey").value.trim();
  const status = document.getElementById("apiStatus");
  if (apiKey.startsWith("AIza")) {
    status.innerText = "✅ API key siap digunakan";
  } else {
    status.innerText = "";
  }
}

async function generateKeywords() {
  const title = document.getElementById("titleInput").value.trim();
  const apiKey = document.getElementById("apiKey").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "⏳ Memproses...";

  if (!title || !apiKey) {
    resultDiv.innerHTML = "⚠️ Masukkan judul dan API key.";
    return;
  }

  try {
    const prompt = `Generate exactly 45 keywords in English based on the title: "${title}".
Rules:
- All keywords must be lowercase, in 1 word only (no multi-word phrases).
- First keyword must directly relate to the title.
- Keywords must be relevant to Adobe Stock standards (accurate, searchable, visual).
- Avoid brands, repetition, or abstract irrelevant words.
- Output must be a single line, comma-separated only.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts[0].text) {
      const text = data.candidates[0].content.parts[0].text.trim();
      resultDiv.innerHTML = `<textarea id="keywordOutput" style="width:100%;height:150px;">${text}</textarea>`;
    } else {
      resultDiv.innerHTML = "⚠️ Tidak ada keyword ditemukan. Periksa API key dan input judul.";
    }
  } catch (error) {
    resultDiv.innerHTML = "❌ Terjadi error: " + error.message;
  }
}

function copyKeywords() {
  const keywordText = document.getElementById("keywordOutput");
  if (keywordText) {
    keywordText.select();
    document.execCommand("copy");
    alert("✅ Keyword berhasil dicopy!");
  }
}
