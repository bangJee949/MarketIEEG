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

  const prompt = `
You are a metadata assistant for Adobe Stock contributors.

Please generate exactly 45 relevant, one-word-only keywords in English based on the title: "${title}".

⚠️ RULES:
- Only one word per keyword, all lowercase.
- No proper names, no punctuation, no repetition.
- The first keyword must be the most relevant and come directly from the title.
- Separate keywords using commas only.
- Do not use line breaks, numbers, or explanations.
Just return 45 keywords as: keyword1, keyword2, keyword3, ...
`;

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
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) throw new Error("Respons kosong dari Gemini");

    // Normalisasi pemisahan (bisa koma, newline, bullet, angka, strip)
    const keywords = raw
      .replace(/\\n|\\r/g, ",")             // newline → koma
      .replace(/\\d+\\.|•|\\-/g, ",")        // angka/bullet → koma
      .split(",")                           // pisah pakai koma
      .map(k => k.trim().toLowerCase())
      .filter(k => k && /^[a-zA-Z]+$/.test(k)) // hanya huruf
      .slice(0, 45);

    if (keywords.length < 10) throw new Error("Keyword terlalu sedikit: " + keywords.length);

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
