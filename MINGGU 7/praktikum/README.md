# Jawaban Latihan Soal Evaluasi Mandiri - Modul 7 (Client-side State)

## 1. Perbedaan localStorage dan sessionStorage

| | localStorage | sessionStorage |
|---|---|---|
| Lama data tersimpan | Tetap ada walau tab atau browser ditutup | Hilang saat tab ditutup |
| Cakupan | Dipakai bersama oleh semua tab dari alamat web yang sama | Hanya untuk satu tab itu saja |
| Saat halaman di-refresh | Data tetap ada | Data tetap ada |

**Contoh kasus localStorage:** menyimpan preferensi dark mode atau status tampil/sembunyi aside, karena harus teringat walau browser sudah ditutup lalu dibuka lagi.

**Contoh kasus sessionStorage:** menyimpan isi form komentar yang sedang diketik, supaya tidak hilang kalau halaman ter-refresh sebelum terkirim. Setelah tab ditutup datanya tidak perlu disimpan lagi.

## 2. Mengapa localStorage tidak bisa menyimpan objek/array secara langsung?

localStorage hanya bisa menyimpan data berupa **string**. Kalau objek atau array langsung disimpan, JavaScript mengubahnya otomatis jadi teks seperti `"[object Object]"`, sehingga isi aslinya hilang.

**Solusinya** adalah memakai JSON: diubah jadi string dengan `JSON.stringify()` sebelum disimpan, lalu dikembalikan jadi objek/array dengan `JSON.parse()` setelah diambil.

```js
const daftar = [{ nama: "Budi", pesan: "Halo" }];

// simpan
localStorage.setItem("komentar", JSON.stringify(daftar));

// ambil
const hasil = JSON.parse(localStorage.getItem("komentar"));
```

## 3. Apa yang terjadi jika `JSON.parse(localStorage.getItem("data"))` dijalankan padahal kunci "data" belum pernah disimpan?

`localStorage.getItem("data")` akan mengembalikan `null` karena kuncinya belum ada. Hasil `JSON.parse(null)` juga `null`. Kodenya sendiri belum error, tapi kalau hasilnya langsung dipakai sebagai array atau objek (misalnya `.push()` atau `.forEach()`), akan muncul error `TypeError` karena `null` tidak punya method itu.

**Cara aman:** beri nilai cadangan memakai operator `||`.

```js
const daftar = JSON.parse(localStorage.getItem("data")) || [];
```

Jadi kalau kuncinya belum ada, `daftar` otomatis berisi array kosong dan kode di bawahnya tetap berjalan.

## 4. Mengapa data di localStorage perlu dimuat ulang secara eksplisit lewat JavaScript tiap halaman dibuka?

Karena localStorage hanya **tempat menyimpan data**, bukan bagian dari tampilan. Setiap halaman dibuka atau di-refresh, HTML dan JavaScript dijalankan dari awal: variabel kembali kosong dan DOM kembali seperti isi file HTML. Data di localStorage tidak otomatis ditampilkan.

Karena itu, tiap halaman dibuka JavaScript harus membaca datanya dengan `getItem()`, lalu menampilkannya ke halaman (misalnya dengan `createElement` dan `appendChild`, atau `classList.add`), contohnya fungsi `muatKomentar()` atau `muatPreferensiTema()`.

## 5. Kode memeriksa kunci "pengguna" dan menyimpan default jika belum ada

```js
// cek apakah kunci "pengguna" sudah ada di localStorage
if (localStorage.getItem("pengguna") === null) {
  // kalau belum ada, simpan nilai default
  localStorage.setItem("pengguna", JSON.stringify({ nama: "Tamu" }));
}

// ambil kembali datanya sebagai objek
const pengguna = JSON.parse(localStorage.getItem("pengguna"));
console.log(pengguna.nama); // "Tamu"
```
