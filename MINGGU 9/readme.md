# Jawaban Latihan Soal Evaluasi Mandiri

Modul 8 — Fetch API dan JSON (Pemrograman Berbasis Web)

---

## 1. Mengapa pengambilan data dari server dilakukan secara asynchronous, bukan synchronous?

Mengambil data lewat internet butuh waktu yang tidak pasti, tergantung koneksi dan beban server. Kalau dilakukan secara synchronous, JavaScript harus menunggu sampai data datang dulu baru lanjut ke kode berikutnya, sehingga seluruh halaman "membeku" (tidak bisa diklik atau di-scroll). Dengan asynchronous, proses pengambilan data berjalan di belakang, jadi browser tetap responsif dan kode lain tetap bisa jalan. Setelah data datang, baru hasilnya diproses.

---

## 2. Apa perbedaan `fetch(url)` dan `response.json()`? Mengapa keduanya sama-sama memerlukan `await` / `then`?

- `fetch(url)` mengirim request ke server dan mengembalikan Promise yang berisi objek `Response`. Promise ini selesai saat server sudah membalas (header dan status sudah diterima), tetapi isi datanya belum dibaca.
- `response.json()` membaca isi (body) dari `Response` tersebut lalu mengubah teks JSON menjadi objek atau array JavaScript.

Keduanya sama-sama mengembalikan **Promise** karena sama-sama butuh waktu: `fetch` menunggu balasan server, sedangkan `response.json()` menunggu body selesai dibaca dan di-parse. Karena hasilnya belum tersedia langsung, keduanya harus ditunggu dengan `await` atau `.then()`.

```js
const response = await fetch(url);        // tunggu balasan server
const data = await response.json();       // tunggu body dibaca jadi objek JS
```

---

## 3. Mengapa `fetch()` tidak otomatis melempar error meskipun server mengembalikan status 404, dan bagaimana menanganinya?

`fetch()` hanya menganggap gagal (Promise *rejected*) kalau request tidak sampai ke server, misalnya karena internet mati atau DNS gagal. Status 404 atau 500 tetap dianggap berhasil, karena server memang membalas, hanya saja isinya "tidak ditemukan" atau "error server". Jadi Promise tetap *fulfilled* dan `catch` tidak jalan.

Cara menanganinya: cek `response.ok` secara manual, lalu lempar error sendiri.

```js
const response = await fetch(url);
if (!response.ok) {
  throw new Error("Status: " + response.status);
}
```

Dengan begitu error HTTP juga masuk ke blok `catch`.

---

## 4. Tulis ulang potongan kode fetch berbasis `then/catch` menjadi versi `async/await`.

Versi `then/catch`:

```js
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Status: " + response.status);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Gagal mengambil data:", error);
  });
```

Versi `async/await`:

```js
async function ambilData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    if (!response.ok) {
      throw new Error("Status: " + response.status);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
}
ambilData();
```

---

## 5. Mengapa indikator loading penting ditampilkan saat data sedang diambil dari API, terutama pada koneksi lambat?

Selama data belum datang, halaman terlihat kosong, dan pengguna tidak tahu apakah halamannya rusak, macet, atau memang sedang memuat. Indikator loading memberi tahu bahwa proses sedang berjalan, jadi pengguna mau menunggu dan tidak langsung menutup halaman atau me-refresh berulang kali. Ini makin penting di koneksi lambat, karena waktu tunggunya lebih lama dan rasa bingungnya lebih besar.