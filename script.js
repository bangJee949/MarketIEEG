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

  status.innerHTML = "⏳ Menghubungi Gemini API...";

  const prompt = `
You are an Adobe Stock metadata assistant.

Title: "${title}"

Please return exactly 45 relevant keywords in English, based on the title above.

⚠️ Format Rules:
- One word per keyword
- Use only lowercase English
- No punctuation, no numbers, no explanation
- Return as: keyword1, keyword2, keyword3, ...
`;

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
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
    console.log("Full response:", data); // Debug

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      throw new Error("Respons dari Gemini kosong atau tidak valid.");
    }

    const keywords = raw
      .replace(/\\n/g, ",")
      .replace(/\\d+\\.|•|\\-/g, ",")
      .split(/,|\\n|\\r/)
      .map(k => k.trim().toLowerCase())
      .filter(k => k && /^[a-z]+$/.test(k))
      .slice(0, 45);

    if (keywords.length < 10) {
      throw new Error("Jumlah keyword terlalu sedikit. Coba ulangi.");
    }

    output.value = keywords.join(", ");
    status.innerHTML = "✅ Keyword berhasil dibuat";
    status.style.color = "green";
  } catch (err) {
    console.error("❌ ERROR:", err);
    status.innerHTML = "⚠️ Gagal menghasilkan keyword. Periksa API key atau format judul.";
    status.style.color = "red";
  }
}

}
