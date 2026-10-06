// ambil elemen yang sering dipakai
var form = document.getElementById("formDaftar");
var modal = document.getElementById("modal");

// tanggal lahir tidak boleh lebih dari hari ini
document.getElementById("tglLahir").max = new Date().toISOString().split("T")[0];

// ================= FUNGSI BANTUAN =================

// nampilin pesan error di bawah input
function tampilError(id, pesan) {
    document.getElementById("err-" + id).innerText = pesan;
    var elemen = document.getElementById(id);
    if (elemen) {
        elemen.classList.add("salah");
    }
}

// hapus pesan error
function hapusError(id) {
    document.getElementById("err-" + id).innerText = "";
    var elemen = document.getElementById(id);
    if (elemen) {
        elemen.classList.remove("salah");
    }
}

// cek apakah isinya angka semua
function cekAngka(teks) {
    for (var i = 0; i < teks.length; i++) {
        if (teks[i] < "0" || teks[i] > "9") {
            return false;
        }
    }
    return true;
}

// cek huruf dan spasi saja (buat nama)
function cekHuruf(teks) {
    var pola = /^[A-Za-z .,']+$/;
    return pola.test(teks);
}

// hitung umur dari tanggal lahir
function hitungUmur(tanggal) {
    var lahir = new Date(tanggal);
    var sekarang = new Date();
    var umur = sekarang.getFullYear() - lahir.getFullYear();
    var selisihBulan = sekarang.getMonth() - lahir.getMonth();
    if (selisihBulan < 0 || (selisihBulan === 0 && sekarang.getDate() < lahir.getDate())) {
        umur--;
    }
    return umur;
}

// ================= FUNGSI VALIDASI =================

// field teks biasa (wajib diisi)
function cekWajib(id, namaField) {
    var nilai = document.getElementById(id).value.trim();
    if (nilai === "") {
        tampilError(id, namaField + " tidak boleh kosong");
        return false;
    }
    hapusError(id);
    return true;
}

// nama (wajib, huruf saja, minimal 3 karakter)
function cekNama(id, namaField) {
    var nilai = document.getElementById(id).value.trim();
    if (nilai === "") {
        tampilError(id, namaField + " tidak boleh kosong");
        return false;
    }
    if (!cekHuruf(nilai)) {
        tampilError(id, namaField + " hanya boleh berisi huruf");
        return false;
    }
    if (nilai.length < 3) {
        tampilError(id, namaField + " minimal 3 karakter");
        return false;
    }
    hapusError(id);
    return true;
}

// field angka dengan panjang tertentu (NIK, NISN, kode pos)
function cekAngkaPanjang(id, namaField, panjang) {
    var nilai = document.getElementById(id).value.trim();
    if (nilai === "") {
        tampilError(id, namaField + " tidak boleh kosong");
        return false;
    }
    if (!cekAngka(nilai)) {
        tampilError(id, namaField + " hanya boleh berisi angka");
        return false;
    }
    if (nilai.length !== panjang) {
        tampilError(id, namaField + " harus " + panjang + " digit");
        return false;
    }
    hapusError(id);
    return true;
}

// RT / RW (wajib, angka)
function cekRtRw(id, namaField) {
    var nilai = document.getElementById(id).value.trim();
    if (nilai === "") {
        tampilError(id, namaField + " wajib diisi");
        return false;
    }
    if (!cekAngka(nilai)) {
        tampilError(id, namaField + " harus angka");
        return false;
    }
    hapusError(id);
    return true;
}

// nomor HP (angka, diawali 08, 10-13 digit)
function cekHp(id, namaField) {
    var nilai = document.getElementById(id).value.trim();
    if (nilai === "") {
        tampilError(id, namaField + " tidak boleh kosong");
        return false;
    }
    if (!cekAngka(nilai)) {
        tampilError(id, namaField + " hanya boleh berisi angka");
        return false;
    }
    if (nilai.substring(0, 2) !== "08") {
        tampilError(id, namaField + " harus diawali 08");
        return false;
    }
    if (nilai.length < 10 || nilai.length > 13) {
        tampilError(id, namaField + " harus 10-13 digit");
        return false;
    }
    hapusError(id);
    return true;
}

// email
function cekEmail() {
    var nilai = document.getElementById("email").value.trim();
    var pola = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (nilai === "") {
        tampilError("email", "Email tidak boleh kosong");
        return false;
    }
    if (!pola.test(nilai)) {
        tampilError("email", "Format email tidak valid");
        return false;
    }
    hapusError("email");
    return true;
}

// pilihan dropdown
function cekPilihan(id, namaField) {
    var nilai = document.getElementById(id).value;
    if (nilai === "") {
        tampilError(id, "Silakan pilih " + namaField);
        return false;
    }
    hapusError(id);
    return true;
}

// jenis kelamin (radio)
function cekJk() {
    var pilihan = document.getElementsByName("jk");
    for (var i = 0; i < pilihan.length; i++) {
        if (pilihan[i].checked) {
            document.getElementById("err-jk").innerText = "";
            return true;
        }
    }
    document.getElementById("err-jk").innerText = "Jenis kelamin harus dipilih";
    return false;
}

// tanggal lahir (wajib, tidak boleh masa depan, minimal umur 15 tahun)
function cekTglLahir() {
    var nilai = document.getElementById("tglLahir").value;
    var tampilUmur = document.getElementById("umurTampil");
    if (nilai === "") {
        tampilUmur.innerText = "";
        tampilError("tglLahir", "Tanggal lahir tidak boleh kosong");
        return false;
    }
    if (new Date(nilai) > new Date()) {
        tampilUmur.innerText = "";
        tampilError("tglLahir", "Tanggal lahir tidak boleh lebih dari hari ini");
        return false;
    }
    var umur = hitungUmur(nilai);
    tampilUmur.innerText = "Umur kamu: " + umur + " tahun";
    if (umur < 15) {
        tampilError("tglLahir", "Umur minimal 15 tahun");
        return false;
    }
    hapusError("tglLahir");
    return true;
}

// tahun lulus (4 digit, 2015 - 2026)
function cekTahunLulus() {
    var nilai = document.getElementById("thLulus").value.trim();
    if (nilai === "") {
        tampilError("thLulus", "Tahun lulus tidak boleh kosong");
        return false;
    }
    if (!cekAngka(nilai) || nilai.length !== 4) {
        tampilError("thLulus", "Tahun lulus harus 4 digit angka");
        return false;
    }
    var tahun = parseInt(nilai);
    if (tahun < 2015 || tahun > 2026) {
        tampilError("thLulus", "Tahun lulus harus antara 2015 - 2026");
        return false;
    }
    hapusError("thLulus");
    return true;
}

// foto (wajib, jpg/png, maksimal 2 MB)
function cekFoto() {
    var input = document.getElementById("foto");
    if (input.files.length === 0) {
        tampilError("foto", "Pas foto wajib diupload");
        return false;
    }
    var file = input.files[0];
    var nama = file.name.toLowerCase();
    var formatBenar = nama.endsWith(".jpg") || nama.endsWith(".jpeg") || nama.endsWith(".png");
    if (!formatBenar) {
        tampilError("foto", "Format foto harus JPG atau PNG");
        return false;
    }
    if (file.size > 2 * 1024 * 1024) {
        tampilError("foto", "Ukuran foto maksimal 2 MB");
        return false;
    }
    hapusError("foto");
    return true;
}

// pilihan prodi 2 tidak boleh sama dengan prodi 1
function cekProdi() {
    var p1 = cekPilihan("prodi1", "program studi pilihan 1");
    var p2 = cekPilihan("prodi2", "program studi pilihan 2");
    if (p1 && p2) {
        if (document.getElementById("prodi1").value === document.getElementById("prodi2").value) {
            tampilError("prodi2", "Pilihan 2 tidak boleh sama dengan pilihan 1");
            return false;
        }
    }
    return p1 && p2;
}

// alasan memilih prodi (minimal 20 karakter)
function cekMotivasi() {
    var nilai = document.getElementById("motivasi").value.trim();
    if (nilai === "") {
        tampilError("motivasi", "Alasan tidak boleh kosong");
        return false;
    }
    if (nilai.length < 20) {
        tampilError("motivasi", "Alasan minimal 20 karakter (sekarang " + nilai.length + ")");
        return false;
    }
    hapusError("motivasi");
    return true;
}

// checkbox pernyataan
function cekSetuju() {
    if (!document.getElementById("setuju").checked) {
        document.getElementById("err-setuju").innerText = "Anda harus menyetujui pernyataan ini";
        return false;
    }
    document.getElementById("err-setuju").innerText = "";
    return true;
}

// ================= DAFTAR ATURAN PER FIELD =================
// dipakai buat validasi real-time dan pas submit
var aturan = {
    nama: function () { return cekNama("nama", "Nama lengkap"); },
    tempatLahir: function () { return cekWajib("tempatLahir", "Tempat lahir"); },
    tglLahir: cekTglLahir,
    agama: function () { return cekPilihan("agama", "agama"); },
    nik: function () { return cekAngkaPanjang("nik", "NIK", 16); },
    warga: function () { return cekPilihan("warga", "kewarganegaraan"); },
    foto: cekFoto,
    jalan: function () { return cekWajib("jalan", "Jalan"); },
    rt: function () { return cekRtRw("rt", "RT"); },
    rw: function () { return cekRtRw("rw", "RW"); },
    kelurahan: function () { return cekWajib("kelurahan", "Kelurahan"); },
    kecamatan: function () { return cekWajib("kecamatan", "Kecamatan"); },
    kota: function () { return cekWajib("kota", "Kabupaten/Kota"); },
    kodePos: function () { return cekAngkaPanjang("kodePos", "Kode pos", 5); },
    tinggal: function () { return cekPilihan("tinggal", "jenis tinggal"); },
    hp: function () { return cekHp("hp", "No. HP"); },
    email: cekEmail,
    sekolah: function () { return cekWajib("sekolah", "Nama sekolah"); },
    jurusan: function () { return cekPilihan("jurusan", "jurusan"); },
    nisn: function () { return cekAngkaPanjang("nisn", "NISN", 10); },
    thLulus: cekTahunLulus,
    namaAyah: function () { return cekNama("namaAyah", "Nama ayah"); },
    kerjaAyah: function () { return cekWajib("kerjaAyah", "Pekerjaan ayah"); },
    namaIbu: function () { return cekNama("namaIbu", "Nama ibu"); },
    kerjaIbu: function () { return cekWajib("kerjaIbu", "Pekerjaan ibu"); },
    hpOrtu: function () { return cekHp("hpOrtu", "No. HP orang tua"); },
    prodi1: function () { return cekPilihan("prodi1", "program studi pilihan 1"); },
    prodi2: cekProdi,
    motivasi: cekMotivasi
};

// ================= VALIDASI REAL-TIME =================
for (var id in aturan) {
    pasangRealtime(id);
}

function pasangRealtime(id) {
    var elemen = document.getElementById(id);
    // dicek pas pindah kolom / pilihan berubah
    elemen.addEventListener("blur", aturan[id]);
    elemen.addEventListener("change", aturan[id]);
    // pas lagi ngetik, kalau sebelumnya salah langsung dicek ulang
    elemen.addEventListener("input", function () {
        if (elemen.classList.contains("salah")) {
            aturan[id]();
        }
    });
}

// radio jenis kelamin dan checkbox setuju
var radioJk = document.getElementsByName("jk");
for (var i = 0; i < radioJk.length; i++) {
    radioJk[i].addEventListener("change", cekJk);
}
document.getElementById("setuju").addEventListener("change", cekSetuju);

// ================= FITUR TAMBAHAN =================

// preview foto
document.getElementById("foto").addEventListener("change", function () {
    var preview = document.getElementById("previewFoto");
    var file = this.files[0];
    if (file && cekFoto()) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    } else {
        preview.style.display = "none";
    }
});

// kalau pilih "Lainnya" di jenis tinggal, muncul kolom tambahan
document.getElementById("tinggal").addEventListener("change", function () {
    var box = document.getElementById("boxTinggalLain");
    if (this.value === "Lainnya") {
        box.style.display = "flex";
    } else {
        box.style.display = "none";
        document.getElementById("tinggalLain").value = "";
        hapusError("tinggalLain");
    }
});

// prodi yang sudah dipilih di pilihan 1 dimatikan di pilihan 2
document.getElementById("prodi1").addEventListener("change", function () {
    var prodi2 = document.getElementById("prodi2");
    for (var i = 0; i < prodi2.options.length; i++) {
        var opsi = prodi2.options[i];
        opsi.disabled = (opsi.value !== "" && opsi.value === this.value);
    }
    // kalau pilihan 2 sama dengan yang baru dipilih, dikosongkan
    if (prodi2.value === this.value) {
        prodi2.value = "";
    }
});

// hitung karakter alasan
document.getElementById("motivasi").addEventListener("input", function () {
    document.getElementById("hitungMotivasi").innerText = this.value.length;
});

// progress bar: hitung berapa kolom yang sudah terisi
function updateProgress() {
    var terisi = 0;
    var total = 0;
    for (var id in aturan) {
        total++;
        if (document.getElementById(id).value.trim() !== "") {
            terisi++;
        }
    }
    // jenis kelamin
    total++;
    for (var i = 0; i < radioJk.length; i++) {
        if (radioJk[i].checked) {
            terisi++;
            break;
        }
    }
    // checkbox pernyataan
    total++;
    if (document.getElementById("setuju").checked) {
        terisi++;
    }

    var persen = Math.round((terisi / total) * 100);
    document.getElementById("persen").innerText = persen;
    document.getElementById("barProgress").style.width = persen + "%";
}

form.addEventListener("input", updateProgress);
form.addEventListener("change", updateProgress);

// ================= SUBMIT & RINGKASAN =================

// bikin tabel ringkasan data
function buatRingkasan() {
    var jk = "";
    for (var i = 0; i < radioJk.length; i++) {
        if (radioJk[i].checked) {
            jk = radioJk[i].value;
        }
    }

    var tinggal = document.getElementById("tinggal").value;
    if (tinggal === "Lainnya") {
        tinggal = "Lainnya (" + document.getElementById("tinggalLain").value.trim() + ")";
    }

    var v = function (id) {
        return document.getElementById(id).value.trim();
    };

    var alamat = v("jalan") + ", RT " + v("rt") + "/RW " + v("rw") + ", " + v("kelurahan") +
        ", " + v("kecamatan") + ", " + v("kota") + " " + v("kodePos");

    var data = [
        ["Nama Lengkap", v("nama")],
        ["Jenis Kelamin", jk],
        ["Tempat, Tanggal Lahir", v("tempatLahir") + ", " + v("tglLahir") + " (" + hitungUmur(v("tglLahir")) + " tahun)"],
        ["Agama", v("agama")],
        ["NIK", v("nik")],
        ["Kewarganegaraan", v("warga")],
        ["Pas Foto", document.getElementById("foto").files[0].name],
        ["Alamat", alamat],
        ["Jenis Tinggal", tinggal],
        ["No. HP", v("hp")],
        ["Email", v("email")],
        ["Sekolah Asal", v("sekolah") + " (" + v("jurusan") + ")"],
        ["NISN", v("nisn")],
        ["Tahun Lulus", v("thLulus")],
        ["Ayah", v("namaAyah") + " - " + v("kerjaAyah")],
        ["Ibu", v("namaIbu") + " - " + v("kerjaIbu")],
        ["No. HP Orang Tua", v("hpOrtu")],
        ["Pilihan Prodi 1", v("prodi1")],
        ["Pilihan Prodi 2", v("prodi2")],
        ["Alasan Memilih Prodi", v("motivasi")]
    ];

    var tabel = document.getElementById("tabelRingkasan");
    tabel.innerHTML = "";
    for (var j = 0; j < data.length; j++) {
        var baris = tabel.insertRow();
        baris.insertCell().textContent = data[j][0];
        baris.insertCell().textContent = data[j][1];
    }
}

form.addEventListener("submit", function (e) {
    e.preventDefault(); // biar halaman tidak reload

    var valid = true;

    // cek semua field di daftar aturan
    for (var id in aturan) {
        if (!aturan[id]()) {
            valid = false;
        }
    }

    // yang tidak ada di daftar aturan
    if (!cekJk()) valid = false;
    if (!cekSetuju()) valid = false;
    if (document.getElementById("tinggal").value === "Lainnya") {
        if (!cekWajib("tinggalLain", "Jenis tinggal")) valid = false;
    }

    if (valid) {
        buatRingkasan();
        modal.classList.add("tampil");
    } else {
        alert("Masih ada data yang belum benar, silakan cek lagi.");
        // scroll ke error pertama
        var salahPertama = document.querySelector(".salah");
        if (salahPertama) {
            salahPertama.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
});

// tombol di popup
document.getElementById("btnEdit").addEventListener("click", function () {
    modal.classList.remove("tampil");
});

document.getElementById("btnKirim").addEventListener("click", function () {
    var nama = document.getElementById("nama").value.trim();
    modal.classList.remove("tampil");
    form.reset();
    alert("Pendaftaran berhasil dikirim!\nTerima kasih, " + nama);
});

// ================= RESET =================
form.addEventListener("reset", function () {
    var semuaError = document.getElementsByClassName("error");
    for (var i = 0; i < semuaError.length; i++) {
        semuaError[i].innerText = "";
    }
    var semuaSalah = document.querySelectorAll(".salah");
    for (var j = 0; j < semuaSalah.length; j++) {
        semuaSalah[j].classList.remove("salah");
    }

    // balikin tampilan fitur tambahan
    document.getElementById("previewFoto").style.display = "none";
    document.getElementById("boxTinggalLain").style.display = "none";
    document.getElementById("umurTampil").innerText = "";
    document.getElementById("hitungMotivasi").innerText = "0";

    var prodi2 = document.getElementById("prodi2");
    for (var k = 0; k < prodi2.options.length; k++) {
        prodi2.options[k].disabled = false;
    }

    // progress diupdate setelah form benar-benar kosong
    setTimeout(updateProgress, 0);
});