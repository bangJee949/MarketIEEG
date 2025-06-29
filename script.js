
let apiKey = "";

function saveApiKey() {
  apiKey = document.getElementById("apiKeyInput").value.trim();
  const status = document.getElementById("apiStatus");
  if (apiKey.startsWith("AIza")) {
    status.innerHTML = "✅ API key siap digunakan";
    status.style.color = "green";
  } else {
    status.innerHTML = "❌ API key tidak valid";
    status.style.color = "red";
  }
}

async function generateKeywords() {
  const title = document.getElementById("titleInput").value.trim();
  const output = document.getElementById("output");
  const status = document.getElementById("status");

  output.value = "";
  status.innerHTML = "";

  if (!apiKey || !title) {
    status.innerHTML = "⚠️ Masukkan judul dan simpan API key terlebih dahulu.";
    return;
  }

  status.innerHTML = "⏳ Menghasilkan keyword...";

  const prompt = `45 one-word keywords in English for: "${title}", comma separated only.`;

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    const data = await res.json();
    console.log("Gemini API Response:", data);  // debug log

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("Respons kosong dari Gemini");

    const keywords = raw
      .replace(/\n|\r/g, ",")
      .replace(/\d+\.|•|\-/g, ",")
      .split(",")
      .map(k => k.trim().toLowerCase())
      .filter(k => k && /^[a-zA-Z]+$/.test(k))
      .slice(0, 45);

    if (keywords.length < 5) throw new Error("Keyword terlalu sedikit");

    output.value = keywords.join(", ");
    status.innerHTML = "✅ Keyword berhasil dibuat";
    status.style.color = "green";

  } catch (e) {
    console.error(e);
    status.innerHTML = "⚠️ Gagal menghasilkan keyword. Periksa API key atau format judul.";
    status.style.color = "red";
  }
}

function copyKeywords() {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
  alert("✅ Keyword berhasil dicopy!");
}
