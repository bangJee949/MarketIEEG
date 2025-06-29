async function generateKeywords() {
  const title = document.getElementById("titleInput").value.trim();
  const output = document.getElementById("output");
  const resultBox = document.getElementById("resultBox");

  if (!title) {
    output.innerText = "Masukkan judul terlebih dahulu!";
    resultBox.style.display = "block";
    return;
  }

  output.innerText = "Generating keywords...";
  resultBox.style.display = "block";

  try {
    const response = await fetch("/api/generateKeywords", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    const data = await response.json();
    output.innerText = data.keywords || "Tidak ada keyword ditemukan.";
  } catch (err) {
    output.innerText = "Terjadi error: " + err.message;
  }
}
