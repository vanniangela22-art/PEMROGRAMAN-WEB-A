// ===== 1. Simpan status tampil/sembunyi aside ke localStorage =====
// ambil elemen aside dan tombolnya
var aside = document.getElementById("aside-info");
var tombol = document.getElementById("tombol-aside");

// cek dulu apakah sebelumnya ada preferensi yang tersimpan di localStorage
var status = localStorage.getItem("asideStatus");

if (status === "sembunyi") {
  aside.classList.add("sembunyi");
  tombol.textContent = "Tampilkan Aside";
}

// saat tombol diklik, ganti tampil/sembunyi lalu simpan ke localStorage
tombol.addEventListener("click", function () {
  aside.classList.toggle("sembunyi");

  if (aside.classList.contains("sembunyi")) {
    localStorage.setItem("asideStatus", "sembunyi");
    tombol.textContent = "Tampilkan Aside";
  } else {
    localStorage.setItem("asideStatus", "tampil");
    tombol.textContent = "Sembunyikan Aside";
  }
});


// ===== 2. Komentar + tombol hapus (data disimpan di localStorage) =====
var formKomentar = document.getElementById("form-komentar");
var inputNama = document.getElementById("input-nama");
var inputPesan = document.getElementById("input-pesan");
var daftarKomentar = document.getElementById("daftar-komentar");

// ambil data komentar dari localStorage, kalau belum ada pakai array kosong
var dataKomentar = JSON.parse(localStorage.getItem("komentar")) || [];

// simpan array komentar ke localStorage (diubah ke JSON dulu)
function simpanKomentar() {
  localStorage.setItem("komentar", JSON.stringify(dataKomentar));
}

// tampilkan semua komentar dari array ke halaman
function tampilkanKomentar() {
  // kosongkan dulu supaya tidak dobel
  daftarKomentar.innerHTML = "";

  for (var i = 0; i < dataKomentar.length; i++) {
    var li = document.createElement("li");

    var nama = document.createElement("strong");
    nama.textContent = dataKomentar[i].nama;

    var pesan = document.createElement("p");
    pesan.textContent = dataKomentar[i].pesan;

    // tombol hapus, nomor urutnya disimpan di atribut data-index
    var tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.className = "btn-hapus";
    tombolHapus.setAttribute("data-index", i);

    li.appendChild(nama);
    li.appendChild(pesan);
    li.appendChild(tombolHapus);
    daftarKomentar.appendChild(li);
  }
}

// hapus komentar: hapus dari array, simpan lagi ke localStorage, lalu tampilkan ulang
daftarKomentar.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-hapus")) {
    var index = Number(e.target.getAttribute("data-index"));
    dataKomentar.splice(index, 1);
    simpanKomentar();
    tampilkanKomentar();
  }
});

// kirim komentar baru
formKomentar.addEventListener("submit", function (e) {
  // supaya halaman tidak ter-refresh waktu form dikirim
  e.preventDefault();

  var nama = inputNama.value.trim();
  var pesan = inputPesan.value.trim();

  if (nama === "" || pesan === "") {
    alert("Nama dan komentar harus diisi!");
    return;
  }

  dataKomentar.push({ nama: nama, pesan: pesan });
  simpanKomentar();
  tampilkanKomentar();

  // form dikosongkan, draft di sessionStorage juga dihapus karena sudah terkirim
  formKomentar.reset();
  sessionStorage.removeItem("draftKomentar");
});

// tampilkan komentar yang sudah tersimpan waktu halaman dibuka
tampilkanKomentar();


// ===== 3. (Opsional) sessionStorage: simpan sementara isi form yang sedang diketik =====
function simpanDraft() {
  var draft = { nama: inputNama.value, pesan: inputPesan.value };
  sessionStorage.setItem("draftKomentar", JSON.stringify(draft));
}

// kalau ada draft (misalnya habis di-refresh), isi lagi ke form
var draftTersimpan = JSON.parse(sessionStorage.getItem("draftKomentar"));
if (draftTersimpan) {
  inputNama.value = draftTersimpan.nama;
  inputPesan.value = draftTersimpan.pesan;
}

// setiap ada ketikan, draft langsung disimpan
inputNama.addEventListener("input", simpanDraft);
inputPesan.addEventListener("input", simpanDraft);