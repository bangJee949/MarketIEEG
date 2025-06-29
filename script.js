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
You are a metadata assistant for stock contributors.

Please generate exactly 45 relevant keywords for Adobe Stock based on this title: "${title}".

Rules:
- Keywords must be in English and only one word each (e.g., "sunset", not "sunset light").
- No brand names, no proper names unless generic.
- The first keyword must be taken directly from the title and be the main subject.
- Separate all keywords using only commas. Do not use line breaks, numbers, or bullet points.
- Follow Adobe Stock keyword guidelines strictly.
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

    if (!raw || !raw.includes(",")) {
      throw new Error("Respons dari API tidak sesuai format.");
    }

    const keywords = raw
      .split(",")
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 1)
      .slice(0, 45);

    if (keywords.length === 0) {
      throw new Error("Tidak ada keyword ditemukan.");
    }

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
