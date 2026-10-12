tugas minggu 6
# Formulir Pendaftaran Mahasiswa Baru

Tugas Praktikum 6 - Validasi Form (Pemrograman Berbasis Web).
Formulir pendaftaran mahasiswa baru dengan validasi sisi client memakai HTML, CSS, dan JavaScript (tanpa library).

## Cara Menjalankan
1. Extract folder, pastikan `index.html`, `style.css`, dan `script.js` ada di folder yang sama.
2. Buka `index.html` di browser (atau pakai Live Server di VS Code).

## Fitur
| Fitur | Fungsi |
|---|---|
| Validasi wajib isi | Semua kolom bertanda `*` tidak boleh kosong |
| Validasi format | NIK 16 digit, NISN 10 digit, kode pos 5 digit, HP diawali 08 (10-13 digit), format email, nama hanya huruf |
| Validasi real-time | Error muncul saat pindah kolom dan hilang otomatis setelah isian benar |
| Pesan error per kolom | Pesan merah di bawah kolom + kolom berwarna merah supaya mudah dicari |
| Progress bar | Menunjukkan persentase kolom yang sudah terisi |
| Upload foto + preview | Cek format (JPG/PNG) dan ukuran (maks 2 MB), lalu tampil preview |
| Umur otomatis | Umur dihitung dari tanggal lahir, minimal 15 tahun |
| Prodi pilihan 2 | Prodi yang sudah dipilih di pilihan 1 otomatis dinonaktifkan |
| Jenis tinggal "Lainnya" | Memunculkan kolom isian tambahan |
| Penghitung karakter | Alasan memilih prodi minimal 20 dan maksimal 200 karakter |
| Popup ringkasan | Menampilkan data untuk dicek ulang sebelum dikirim |
| Tombol reset | Mengosongkan form beserta semua pesan error dan tampilan tambahan |

## Struktur File
- `index.html` : struktur dan isi formulir
- `style.css` : tampilan formulir
- `script.js` : semua logika validasi dan fitur tambahan

## Latihan Soal Evaluasi Mandiri

### 1. Mengapa validasi client-side tidak boleh menjadi satu-satunya lapisan validasi?
Validasi client-side bisa dilewati. User bisa mematikan JavaScript, mengubah HTML lewat DevTools, atau mengirim request langsung ke server (misalnya pakai Postman atau curl). Karena itu validasi di server tetap wajib untuk keamanan dan menjaga kebenaran data, misalnya dari input berbahaya seperti SQL injection atau XSS. Validasi client-side tujuannya untuk kenyamanan user, yaitu feedback cepat dan mengurangi request yang tidak perlu ke server.

### 2. Tiga atribut validasi bawaan HTML5 beserta fungsinya
- `required` : kolom wajib diisi sebelum form bisa dikirim.
- `pattern` : isi kolom harus cocok dengan regex tertentu, contoh `pattern="[0-9]{16}"` untuk NIK.
- `minlength` / `maxlength` : membatasi panjang minimal / maksimal teks.
- `min` / `max` : membatasi nilai angka atau tanggal.
- `type="email"` : otomatis mengecek format email.

### 3. Perbedaan `input.checkValidity()` dan `input.reportValidity()`
- `checkValidity()` hanya mengecek dan mengembalikan `true` atau `false`, tanpa menampilkan pesan apa pun ke user.
- `reportValidity()` juga mengembalikan `true` atau `false`, tapi sekaligus menampilkan pesan error bawaan browser dan memfokuskan ke kolom yang tidak valid.

### 4. Fungsi `setCustomValidity("")` dan mengapa harus dipanggil lagi setelah error diperbaiki
`setCustomValidity("")` menghapus pesan error kustom sehingga kolom dianggap valid lagi. Kalau sebelumnya diisi pesan error (misalnya `setCustomValidity("NIK harus 16 digit")`), kolom akan tetap dianggap tidak valid selama pesan itu belum dikosongkan. Akibatnya, walaupun user sudah memperbaiki isiannya, form tetap tidak bisa dikirim.

### 5. Aturan validasi dan pseudocode field "Tanggal Lahir" tidak boleh di masa depan
Aturan:
- Tanggal lahir wajib diisi.
- Tanggal lahir tidak boleh lebih besar dari tanggal hari ini.

Pseudocode:
```
FUNGSI cekTanggalLahir()
    nilai <- ambil isi input tanggal lahir

    JIKA nilai kosong MAKA
        tampilkan error "Tanggal lahir tidak boleh kosong"
        KEMBALIKAN salah
    SELESAI JIKA

    tglLahir <- ubah nilai menjadi tanggal
    hariIni  <- tanggal sekarang

    JIKA tglLahir > hariIni MAKA
        tampilkan error "Tanggal lahir tidak boleh di masa depan"
        KEMBALIKAN salah
    SELESAI JIKA

    hapus error
    KEMBALIKAN benar
SELESAI FUNGSI
```
Di program ini aturan tersebut ada di fungsi `cekTglLahir()` pada `script.js`. Selain itu, atribut `max` pada input tanggal diisi tanggal hari ini, sehingga kalender di browser juga menolak tanggal masa depan.