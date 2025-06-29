let storedApiKey = "";

function saveApiKey() {
  const keyInput = document.getElementById("apiKey").value.trim();
  const status = document.getElementById("apiStatus");
  if (keyInput.startsWith("AIza")) {
    storedApiKey = keyInput;
    status.innerText = "✅ API key siap digunakan";
    status.style.color = "green";
  } else {
    status.innerText = "❌ API key tidak valid";
    status.style.color = "red";
  }
}

async function generateKeywords() {
  const title = document.getElementById("titleInput").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "⏳ Memproses...";

  if (!title || !storedApiKey) {
    resultDiv.innerHTML = "⚠️ Masukkan judul dan simpan API key terlebih dahulu.";
    return;
  }

  const prompt = `You are a metadata assistant for stock contributors.\\n\\nPlease generate exactly 45 relevant keywords based on this stock content title: "${title}".\\n\\n🔑 GUIDELINES:\\n- All keywords must be in one word only (e.g., "sunset", not "sunset light").\\n- No brands, names, or locations unless generic.\\n- Keywords must be highly relevant and searchable.\\n- First keyword must be the most important topic (from the title).\\n- Separate keywords with commas only, no numbering or line breaks.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${storedApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
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
