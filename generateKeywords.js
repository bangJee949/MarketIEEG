export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { title } = req.body;

  const mainKeywords = title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(" ")
    .filter(word => word.length > 1)
    .slice(0, 3)
    .join(", ");

  const prompt = `
Judul konten: "${title}"
Keyword utama dari judul: ${mainKeywords}

Buatkan minimal 45 keyword relevan dan tidak duplikat untuk konten stok Adobe Stock. Pastikan:
- Keyword relevan dengan isi judul dan konteksnya (gaya, teknik, efek visual, warna, suasana, kegunaan, estetika, kamera, dll)
- Menggunakan kata-kata populer di Adobe Stock
- Format output hanya berupa daftar keyword dipisahkan koma (tanpa angka, tanpa bullet, tanpa penjelasan)
`;

  const geminiBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const geminiRes = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=\${process.env.GEMINI_API_KEY}\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      }
    );
    const result = await geminiRes.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "No keywords generated.";

    return res.status(200).json({ keywords: text });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
