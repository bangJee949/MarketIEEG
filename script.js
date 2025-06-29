
async function generateKeywords() {
  const title = document.getElementById("titleInput").value.trim();
  const apiKey = document.getElementById("apiKey").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Memproses...";

  if (!title || !apiKey) {
    resultDiv.innerHTML = "Masukkan judul dan API key.";
    return;
  }

  try {
    const prompt = `Buatkan tepat 45 keyword yang relevan dan sesuai dengan panduan Adobe Stock berdasarkan judul: "${title}". Gunakan standar metadata Adobe Stock agar mudah ditemukan pembeli dan laku. Keyword pertama harus berasal dari judul, sisanya dikembangkan agar sesuai pencarian populer.`;

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

    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text.trim();
      resultDiv.innerHTML = `<textarea id="keywordOutput" style="width:100%;height:150px;">${text}</textarea>`;
    } else {
      resultDiv.innerHTML = "Tidak ada keyword ditemukan.";
    }
  } catch (error) {
    resultDiv.innerHTML = "Terjadi error: " + error.message;
  }
}

function copyKeywords() {
  const keywordText = document.getElementById("keywordOutput");
  if (keywordText) {
    keywordText.select();
    document.execCommand("copy");
    alert("Keyword berhasil dicopy!");
  }
}
