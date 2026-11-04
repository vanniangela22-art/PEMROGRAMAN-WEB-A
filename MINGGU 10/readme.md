# Jawaban Latihan Soal Evaluasi Mandiri

## 1. Jelaskan pemetaan antara operasi CRUD dan method HTTP pada REST API.

Setiap resource punya satu URL (endpoint), dan method HTTP menyatakan aksi yang dilakukan pada resource itu.

| Operasi CRUD | Method HTTP | Contoh endpoint |
|---|---|---|
| Create (buat data baru) | POST | `/comments` |
| Read (baca data) | GET | `/comments`, `/comments/5` |
| Update (perbarui data) | PUT / PATCH | `/comments/5` |
| Delete (hapus data) | DELETE | `/comments/5` |

## 2. Apa perbedaan mendasar antara method PUT dan PATCH? Berikan contoh kasus yang lebih tepat untuk salah satunya.

- **PUT** mengganti seluruh objek dengan data baru yang dikirim. Field yang tidak disertakan bisa dianggap hilang atau menjadi null.
- **PATCH** hanya memperbarui field yang disertakan di request. Field lain tetap seperti semula.

Contoh kasus:
- **PATCH** lebih tepat untuk mengubah isi komentar saja atau menambah jumlah like, karena hanya satu field yang berubah (`{ body: "..." }` atau `{ likes: 5 }`).
- **PUT** lebih tepat saat seluruh data memang diganti, misalnya form edit profil yang mengirim semua field (nama, email, alamat, dst.) sekaligus.

## 3. Mengapa header Content-Type: application/json perlu disertakan saat mengirim data lewat POST/PUT/PATCH?

- Header ini memberi tahu server bahwa body yang dikirim berformat JSON, sehingga server tahu cara membacanya.
- Tanpa header ini, body string dari `JSON.stringify()` dikirim sebagai `text/plain`. Server bisa gagal membaca datanya, menganggap body kosong, atau menolak request (mis. 400/415).
- Header ini dipasang pada POST/PUT/PATCH karena ketiganya mengirim body.

## 4. Jelaskan arti status code 201, 204, dan 404, masing-masing pada konteks operasi CRUD yang sesuai.

| Status | Arti | Konteks CRUD |
|---|---|---|
| 201 Created | Data baru berhasil dibuat | Create (POST), biasanya server mengembalikan data baru beserta id-nya |
| 204 No Content | Berhasil, tetapi tidak ada body yang dikembalikan | Delete (DELETE) |
| 404 Not Found | Resource dengan id tersebut tidak ditemukan | Read/Update/Delete pada id yang tidak ada, mis. `/tugas/9999` |

## 5. Tuliskan kode Fetch API untuk mengirim DELETE ke endpoint /tugas/10, lengkap dengan penanganan jika gagal.

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