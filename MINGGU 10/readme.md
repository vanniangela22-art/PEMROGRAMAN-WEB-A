# Tugas Praktikum Mandiri B.7 - Konsumsi REST API

Mata kuliah: Pemrograman Berbasis Web (PROG31W)
Topik: POST, PATCH, dan DELETE pada fitur komentar & like

## Isi Folder

| File | Keterangan |
|---|---|
| `index.html` | Halaman blog dengan form komentar, daftar komentar, dan tombol like |
| `style.css` | Tampilan halaman (termasuk gaya tombol saat loading/disabled) |
| `script.js` | Logika fetch ke API dan manipulasi DOM |
| `README.md` | Penjelasan tugas dan jawaban latihan soal evaluasi |

## Cara Menjalankan

1. Buka folder di VS Code.
2. Buka `index.html` di browser (bisa pakai Live Server).
3. Buka DevTools, tab **Network**, untuk melihat request POST/PATCH/DELETE.

## Fitur yang Dikerjakan

| Ketentuan tugas | Implementasi |
|---|---|
| Edit komentar via PATCH | Tombol **Edit** mengisi form dengan isi komentar, lalu **Simpan Perubahan** mengirim PATCH ke `/comments/{id}` |
| `pesanDariStatus()` konsisten | Dipakai di `catch` pada POST, PATCH (edit & like), DELETE, dan GET awal |
| Indikator loading | Tombol dinonaktifkan dan teksnya berubah ("Mengirim...", "Menghapus...") lewat fungsi `aturLoading()` |

Fitur lain dari praktikum B.2-B.5 tetap ada: kirim komentar (POST), hapus komentar (DELETE, event delegation), dan like (PATCH).

## Alur Singkat di script.js

- `cekResponse()` : kalau `response.ok` false, melempar error yang membawa `status`.
- `pesanDariStatus(status)` : mengubah status code jadi pesan untuk pengguna.
- `kirimKomentarKeServer()`, `editKomentarKeServer()`, `hapusKomentarDiServer()`, `perbaruiLikeKeServer()` : fungsi request ke server.
- Variabel `liEdit` menandai mode form: `null` = kirim baru, berisi `<li>` = sedang edit.

## Catatan

- API yang dipakai adalah JSONPlaceholder, yang hanya mensimulasikan respons dan tidak menyimpan data permanen.
- Komentar baru dari POST selalu mendapat id `501`. Karena tidak benar-benar tersimpan, PATCH ke id tersebut bisa mengembalikan error (mis. 500). Itu normal, dan bisa dipakai untuk melihat pesan error dari `pesanDariStatus()`.
- Untuk menguji PATCH dan DELETE yang berhasil, pakai komentar awal yang diambil dari `/posts/1/comments` (id 1-3).

---

# Jawaban Latihan Soal Evaluasi Mandiri

## 1. Pemetaan operasi CRUD ke method HTTP

Setiap resource punya satu URL (endpoint), dan method HTTP menyatakan aksi yang dilakukan pada resource itu.

| Operasi CRUD | Method HTTP | Contoh endpoint |
|---|---|---|
| Create (buat data baru) | POST | `/comments` |
| Read (baca data) | GET | `/comments`, `/comments/5` |
| Update (perbarui data) | PUT / PATCH | `/comments/5` |
| Delete (hapus data) | DELETE | `/comments/5` |

## 2. Perbedaan PUT dan PATCH

- **PUT** mengganti seluruh objek dengan data baru yang dikirim. Field yang tidak disertakan bisa dianggap hilang atau menjadi null.
- **PATCH** hanya memperbarui field yang disertakan di request. Field lain tetap seperti semula.

Contoh kasus:
- **PATCH** lebih tepat untuk mengubah isi komentar saja atau menambah jumlah like, karena hanya satu field yang berubah (`{ body: "..." }` atau `{ likes: 5 }`).
- **PUT** lebih tepat saat seluruh data memang diganti, misalnya form edit profil yang mengirim semua field (nama, email, alamat, dst.) sekaligus.

## 3. Alasan header `Content-Type: application/json`

- Header ini memberi tahu server bahwa body yang dikirim berformat JSON, sehingga server tahu cara membacanya.
- Tanpa header ini, body string dari `JSON.stringify()` dikirim sebagai `text/plain`. Server bisa gagal membaca datanya, menganggap body kosong, atau menolak request (mis. 400/415).
- Header ini dipasang pada POST/PUT/PATCH karena ketiganya mengirim body. DELETE dan GET biasanya tidak membawa body.

## 4. Arti status code 201, 204, dan 404

| Status | Arti | Konteks CRUD |
|---|---|---|
| 201 Created | Data baru berhasil dibuat | Create (POST), biasanya server mengembalikan data baru beserta id-nya |
| 204 No Content | Berhasil, tetapi tidak ada body yang dikembalikan | Delete (DELETE) |
| 404 Not Found | Resource dengan id tersebut tidak ditemukan | Read/Update/Delete pada id yang tidak ada, mis. `/tugas/9999` |

## 5. Kode Fetch API untuk DELETE ke `/tugas/10`

```javascript
async function hapusTugas() {
  try {
    const response = await fetch("https://api.example.com/tugas/10", {
      method: "DELETE",
    });

    // kalau status bukan 2xx, anggap gagal
    if (!response.ok) {
      throw new Error("Gagal menghapus, status: " + response.status);
    }

    console.log("Tugas 10 berhasil dihapus dari server");
  } catch (error) {
    // masuk sini kalau status error atau koneksi bermasalah
    console.error(error);
    alert("Gagal menghapus tugas, silakan coba lagi.");
  }
}

hapusTugas();
```

Keterangan:
- DELETE tidak memakai `body` dan tidak perlu `Content-Type`.
- `response.ok` bernilai `true` untuk status 200-299 (termasuk 200 dan 204).
- `try...catch` menangani status error (mis. 404) yang dilempar manual, serta kegagalan jaringan.
- URL `api.example.com` hanya contoh; ganti dengan base URL API yang dipakai.