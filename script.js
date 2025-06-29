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

  if (!apiKey || !title) {
    status.innerHTML = "⚠️ Tidak ada keyword ditemukan. Periksa API key dan input judul.";
    return;
  }

  status.innerHTML = "⏳ Menghasilkan keyword...";
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Buatkan 45 keyword satu kata dalam bahasa Inggris yang relevan dari judul konten: "${title}". Gunakan panduan Adobe Stock: https://helpx.adobe.com/stock/contributor/help/titles-and-keyword.html`
          }]
        }]
      })
    });

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("Tidak ada data");

    const keywords = raw.split(/,|\\n|\\*/).map(k => k.trim()).filter(k => k.length > 1).slice(0, 45);
    output.value = keywords.join(", ");
    status.innerHTML = "✅ Keyword berhasil dibuat";
  } catch (e) {
    output.value = "";
    status.innerHTML = "⚠️ Gagal menghasilkan keyword. Coba ulangi.";
  }
}

function copyKeywords() {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
}
