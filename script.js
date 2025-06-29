
async function generateKeywords() {
  const title = document.getElementById("titleInput").value;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Memproses...";

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBZJQqBwIf0O8-ykTO-G4LTpNaDFb1v5_E", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Buatkan 45 keyword relevan dan sesuai standar Adobe Stock dari judul: ${title}`
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const keywords = data.candidates[0].content.parts[0].text;
      resultDiv.innerHTML = keywords;
    } else {
      resultDiv.innerHTML = "Tidak ada keyword ditemukan.";
    }
  } catch (error) {
    resultDiv.innerHTML = "Terjadi error: " + error.message;
  }
}
