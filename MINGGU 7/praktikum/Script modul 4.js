// ===== Langkah 1: variabel dan seleksi elemen =====
// cek di console (F12) apakah JavaScript sudah nyambung ke HTML
const judulSitus = document.querySelector("header h1");
console.log(judulSitus);
console.log(judulSitus.textContent);


// ===== Langkah 2: tombol dark mode =====
const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
  // kalau class dark-mode belum ada ditambah, kalau sudah ada dihapus
  document.body.classList.toggle("dark-mode");

  // simpan tema terakhir ke localStorage
  const temaSekarang = document.body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("tema", temaSekarang);
}

tombolTema.addEventListener("click", toggleTema);

// waktu halaman dibuka, pasang lagi tema yang tersimpan
function muatPreferensiTema() {
  const tema = localStorage.getItem("tema");
  if (tema === "dark") {
    document.body.classList.add("dark-mode");
  }
}

muatPreferensiTema();


// ===== Langkah 3: tombol tampil/sembunyi aside =====
const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");

tombolInfo.addEventListener("click", () => {
  kotakAside.classList.toggle("tersembunyi");

  // simpan status aside (true = sembunyi) ke localStorage
  localStorage.setItem("asideTersembunyi", kotakAside.classList.contains("tersembunyi"));
});

// waktu halaman dibuka, cek dulu preferensi yang tersimpan
if (localStorage.getItem("asideTersembunyi") === "true") {
  kotakAside.classList.add("tersembunyi");
}


// ===== Langkah 4: render portofolio dari data JavaScript =====
// data portofolio disimpan di array of object, bukan ditulis manual di HTML
// kalau di localStorage sudah ada data, pakai itu. kalau belum, pakai data awal ini
let daftarPortofolio = JSON.parse(localStorage.getItem("portofolio")) || [
  {
    judul: "Lukisan Luffy",
    gambar: "gambar/lukisan-1.jpg",
    alt: "Lukisan Monkey D. Luffy dari One Piece karya Angela",
    deskripsi: "Lukisan karakter Monkey D. Luffy dari anime One Piece.",
  },
  {
    judul: "Kota dan Lampion",
    gambar: "gambar/lukisan-2.jpg",
    alt: "Lukisan pemandangan kota dan lampion karya Angela",
    deskripsi: "Lukisan pemandangan kota dengan lampion di langit.",
  },
  {
    judul: "Lukisan Nanami Kento",
    gambar: "gambar/lukisan-3.jpg",
    alt: "Lukisan Nanami Kento dari Jujutsu Kaisen karya Angela",
    deskripsi: "Lukisan karakter Nanami Kento dari anime Jujutsu Kaisen.",
  },
  {
    judul: "Cosplay Misa Amane",
    gambar: "gambar/cosplay-1.jpg",
    alt: "Angela cosplay menjadi Misa Amane dari Death Note",
    deskripsi: "Saya cosplay menjadi Misa Amane dari anime Death Note.",
  },
  {
    judul: "Mobile Legends - Carmilla",
    gambar: "gambar/screenshot-game-1.jpg",
    alt: "Screenshot riwayat pertandingan Mobile Legends dengan hero Carmilla",
    deskripsi: "Tangkapan layar riwayat pertandingan Mobile Legends dengan hero Carmilla yang berhasil saya menangkan.",
  },
  {
    judul: "Douyin Makeup",
    gambar: "gambar/makeup-1.jpg",
    alt: "Hasil Douyin makeup Angela",
    deskripsi: "Hasil makeup saya dengan gaya Douyin.",
  },
];

const containerPortofolio = document.querySelector(".daftar-artikel");

// simpan isi array daftarPortofolio ke localStorage (diubah ke JSON dulu)
function simpanPortofolio() {
  localStorage.setItem("portofolio", JSON.stringify(daftarPortofolio));
}

// fungsi untuk membuat satu kartu portofolio
// dipisah jadi fungsi supaya bisa dipakai lagi waktu tambah item baru
function buatKartu(data) {
  const article = document.createElement("article");

  // gambar hanya dibuat kalau datanya punya gambar
  if (data.gambar) {
    const gambar = document.createElement("img");
    gambar.src = data.gambar;
    gambar.alt = data.alt;
    article.appendChild(gambar);
  }

  const judul = document.createElement("h3");
  judul.textContent = data.judul;

  const deskripsi = document.createElement("p");
  deskripsi.textContent = data.deskripsi;

  // tombol like untuk tiap item, jumlahnya ikut tersimpan di data
  const tombolLike = document.createElement("button");
  tombolLike.textContent = `Like (${data.like || 0})`;
  tombolLike.classList.add("btn-like");

  // tombol hapus untuk tiap item
  const tombolHapus = document.createElement("button");
  tombolHapus.textContent = "Hapus";
  tombolHapus.classList.add("btn-hapus");

  article.appendChild(judul);
  article.appendChild(deskripsi);
  article.appendChild(tombolLike);
  article.appendChild(tombolHapus);

  return article;
}

daftarPortofolio.forEach((data) => {
  containerPortofolio.appendChild(buatKartu(data));
});


// ===== Tambah item portofolio baru =====
const tombolTambah = document.querySelector("#btn-tambah");

tombolTambah.addEventListener("click", () => {
  const judulBaru = prompt("Masukkan judul portofolio baru:");

  // kalau di-cancel atau dikosongkan, tidak jadi menambah
  if (!judulBaru) {
    return;
  }

  const deskripsiBaru = prompt("Masukkan deskripsi singkat:") || "-";

  const dataBaru = {
    judul: judulBaru,
    gambar: "",
    alt: judulBaru,
    deskripsi: deskripsiBaru,
  };

  daftarPortofolio.push(dataBaru);
  simpanPortofolio();
  containerPortofolio.appendChild(buatKartu(dataBaru));
});


// ===== Langkah 5: like dan hapus item dengan event delegation =====
// cuma satu listener di container, jadi item baru hasil tambah juga ikut kena
containerPortofolio.addEventListener("click", (e) => {
  const kartu = e.target.closest("article");

  // cari urutan kartu supaya tahu data mana di array yang dimaksud
  const urutan = Array.from(containerPortofolio.children).indexOf(kartu);

  if (e.target.classList.contains("btn-like")) {
    daftarPortofolio[urutan].like = (daftarPortofolio[urutan].like || 0) + 1;
    simpanPortofolio();
    e.target.textContent = `Like (${daftarPortofolio[urutan].like})`;
  }

  if (e.target.classList.contains("btn-hapus")) {
    daftarPortofolio.splice(urutan, 1);
    simpanPortofolio();

    kartu.remove();
  }
});


// ===== Komentar + tombol hapus (data disimpan di localStorage) =====
const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const daftarKomentar = document.querySelector("#daftar-komentar");

// ambil data komentar dari localStorage, kalau belum ada pakai array kosong
let dataKomentar = JSON.parse(localStorage.getItem("komentar")) || [];

// simpan array komentar ke localStorage (diubah ke JSON dulu)
function simpanKomentar() {
  localStorage.setItem("komentar", JSON.stringify(dataKomentar));
}

// tampilkan semua komentar dari array ke halaman
function tampilkanKomentar() {
  // kosongkan dulu supaya tidak dobel
  daftarKomentar.innerHTML = "";

  dataKomentar.forEach((k, index) => {
    const li = document.createElement("li");

    const nama = document.createElement("strong");
    nama.textContent = k.nama;

    const pesan = document.createElement("p");
    pesan.textContent = k.pesan;

    // tombol hapus, nomor urutnya disimpan di atribut data-index
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.classList.add("btn-hapus");
    tombolHapus.dataset.index = index;

    li.appendChild(nama);
    li.appendChild(pesan);
    li.appendChild(tombolHapus);
    daftarKomentar.appendChild(li);
  });
}

// hapus komentar: hapus dari array, simpan lagi ke localStorage, lalu tampilkan ulang
daftarKomentar.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-hapus")) {
    const index = Number(e.target.dataset.index);
    dataKomentar.splice(index, 1);
    simpanKomentar();
    tampilkanKomentar();
  }
});

// kirim komentar baru
formKomentar.addEventListener("submit", (e) => {
  // supaya halaman tidak ter-refresh waktu form dikirim
  e.preventDefault();

  const nama = inputNama.value.trim();
  const pesan = inputPesan.value.trim();

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


// ===== (Opsional) sessionStorage: simpan sementara isi form yang sedang diketik =====
function simpanDraft() {
  const draft = { nama: inputNama.value, pesan: inputPesan.value };
  sessionStorage.setItem("draftKomentar", JSON.stringify(draft));
}

// kalau ada draft (misalnya habis di-refresh), isi lagi ke form
const draftTersimpan = JSON.parse(sessionStorage.getItem("draftKomentar"));
if (draftTersimpan) {
  inputNama.value = draftTersimpan.nama;
  inputPesan.value = draftTersimpan.pesan;
}

// setiap ada ketikan, draft langsung disimpan
inputNama.addEventListener("input", simpanDraft);
inputPesan.addEventListener("input", simpanDraft);


// ===== Tombol reset semua data =====
const tombolReset = document.querySelector("#btn-reset");

tombolReset.addEventListener("click", () => {
  const konfirmasi = confirm("Hapus semua data tersimpan (tema, aside, portofolio, komentar)?");

  if (konfirmasi) {
    localStorage.removeItem("tema");
    localStorage.removeItem("asideTersembunyi");
    localStorage.removeItem("portofolio");
    localStorage.removeItem("komentar");
    sessionStorage.removeItem("draftKomentar");

    // muat ulang halaman supaya kembali ke tampilan awal
    location.reload();
  }
});