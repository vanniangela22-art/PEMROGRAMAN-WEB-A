"use strict";

/* =============================================================
   MODUL 7 — FETCH API DAN JSON
   Bagian B — Kegiatan Praktikum (program lengkap: script.js)
   Mata Kuliah: Pemrograman Berbasis Web (PROG31W)

   File KUMULATIF (melanjutkan modul sebelumnya):
     - Basis Modul 3 (JavaScript Dasar & DOM)
     - Modul 4 (Event Handling)
     - Modul 5 (Validasi Form)
     - Modul 6 (Client-side State / localStorage)
     - Modul 7 (Fetch API & JSON)   <-- fokus modul ini

   Perubahan utama Modul 7: data artikel TIDAK lagi dari array statis,
   melainkan diambil dari REST API publik JSONPlaceholder.
   Berpasangan dengan index.html & style.css pada paket yang sama.
   ============================================================= */

const BASE = "https://jsonplaceholder.typicode.com";


/* =========================================================
   BASIS MODUL 3 + Dark Mode (persistensi Modul 6)
   ========================================================= */

const judulSitus = document.querySelector("header h1");
if (judulSitus) {
  console.log(judulSitus.textContent);
}

const tombolTema = document.querySelector("#btn-tema");
function toggleTema() {
  document.body.classList.toggle("dark-mode");
  const temaSekarang = document.body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("tema", temaSekarang);
}
if (tombolTema) tombolTema.addEventListener("click", toggleTema);

function muatPreferensiTema() {
  if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark-mode");
  }
}
muatPreferensiTema();

const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");
if (tombolInfo && kotakAside) {
  tombolInfo.addEventListener("click", () => {
    kotakAside.classList.toggle("tersembunyi");
  });
}


/* =========================================================
   MODUL 7 · B.2-B.5 — Render artikel dari API (Fetch + JSON)
   Menggantikan render data statis Modul 3. Tombol Like/Hapus
   (Modul 4) & persistensi like (Modul 6) tetap dipasang di
   dalam forEach. Dilengkapi indikator loading & penanganan error.
   ========================================================= */

const containerArtikel = document.querySelector(".daftar-artikel");

if (containerArtikel) {
  const loading = document.querySelector("#loading");

  async function muatArtikelDariAPI() {
    if (loading) loading.style.display = "block";       // B.4 tampilkan loading
    try {
      const response = await fetch(BASE + "/posts?_limit=5");
      if (!response.ok) {                               // B.5 cek status HTTP
        throw new Error("Status: " + response.status);
      }
      const daftarPost = await response.json();         // ubah JSON -> array objek

      const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
      daftarPost.forEach((post) => {
        const article = document.createElement("article");

        const judul = document.createElement("h3");
        judul.textContent = post.title;

        const isi = document.createElement("p");
        isi.textContent = post.body;

        // Tombol Like (Modul 4) + nilai tersimpan (Modul 6)
        const tombolLike = document.createElement("button");
        let jumlahLike = semuaLike[post.title] || 0;
        tombolLike.textContent = `Like (${jumlahLike})`;
        tombolLike.dataset.like = jumlahLike;

        // Tombol Hapus (Modul 3)
        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";

        article.appendChild(judul);
        article.appendChild(isi);
        article.appendChild(tombolLike);
        article.appendChild(tombolHapus);
        containerArtikel.appendChild(article);
      });
    } catch (error) {                                   // B.5 tangani kegagalan
      containerArtikel.innerHTML =
        "<p>Gagal memuat artikel. Periksa koneksi internet kamu, lalu muat ulang halaman.</p>";
      console.error("Gagal mengambil data:", error);
    } finally {
      if (loading) loading.style.display = "none";      // selalu matikan loading
    }
  }
  muatArtikelDariAPI();

  /* ---- Event delegation (Modul 4) + persistensi like (Modul 6) ---- */

  containerArtikel.addEventListener("mouseover", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.add("artikel-hover");
  });
  containerArtikel.addEventListener("mouseout", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.remove("artikel-hover");
  });

  containerArtikel.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.textContent.startsWith("Like")) {
      let jumlah = parseInt(e.target.dataset.like || 0);
      jumlah++;
      e.target.dataset.like = jumlah;
      e.target.textContent = `Like (${jumlah})`;
      const judul = e.target.closest("article").querySelector("h3").textContent;
      simpanLike(judul, jumlah);
    }
  });

  containerArtikel.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus") {
      e.target.closest("article").remove();
    }
  });
}

function simpanLike(judulArtikel, jumlah) {
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
  semuaLike[judulArtikel] = jumlah;
  localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
}


/* =========================================================
   MODUL 7 · B.6 — Profil penulis untuk <aside> dari endpoint /users
   ========================================================= */

async function muatProfilPenulis() {
  const namaEl = document.querySelector("#nama-penulis");
  const emailEl = document.querySelector("#email-penulis");
  if (!namaEl || !emailEl) return;
  try {
    const response = await fetch(BASE + "/users/1");
    if (!response.ok) throw new Error("Status: " + response.status);
    const user = await response.json();
    namaEl.textContent = user.name;
    emailEl.textContent = user.email;
  } catch (error) {
    namaEl.textContent = "Gagal memuat data penulis";   // pesan untuk pengguna
    emailEl.textContent = "-";
    console.error("Gagal memuat profil penulis:", error);
  }
}
muatProfilPenulis();


/* =========================================================
   Form komentar: render (Modul 4) + validasi (Modul 5)
   + simpan/muat localStorage (Modul 6)
   ========================================================= */

const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");

function simpanKomentar(nama, pesan) {
  const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
  daftar.push({ nama, pesan });
  localStorage.setItem("komentar", JSON.stringify(daftar));
}

/* Tugas Mandiri B.7 — komentar awal dari endpoint /posts/1/comments */
async function muatKomentarAwal() {
  try {
    const response = await fetch(BASE + "/posts/1/comments");
    if (!response.ok) {
      throw new Error("Status: " + response.status);
    }
    const dataKomentar = await response.json();
    dataKomentar.forEach((k) => {
      const li = document.createElement("li");
      li.textContent = `${k.email}: ${k.body}`;
      daftarKomentar.appendChild(li);
    });
  } catch (error) {
    const li = document.createElement("li");
    li.textContent = "Gagal memuat komentar awal, silakan coba lagi nanti.";
    daftarKomentar.appendChild(li);
    console.error("Gagal mengambil komentar:", error);
  } finally {
    muatKomentar();   // komentar dari localStorage ditaruh setelah komentar API
  }
}

function muatKomentar() {
  const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
  daftar.forEach((k) => {
    const li = document.createElement("li");
    li.textContent = `${k.nama}: ${k.pesan}`;
    daftarKomentar.appendChild(li);
  });
}

if (formKomentar && daftarKomentar) {
  muatKomentarAwal();

  formKomentar.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.querySelector("#input-nama").value.trim();
    const pesan = document.querySelector("#input-pesan").value.trim();
    if (nama === "" || pesan === "") {
      alert("Nama dan komentar wajib diisi!");
      return;
    }
    const itemKomentar = document.createElement("li");
    itemKomentar.textContent = `${nama}: ${pesan}`;
    daftarKomentar.appendChild(itemKomentar);
    simpanKomentar(nama, pesan);
    formKomentar.reset();
  });
}

document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key.toLowerCase() === "d") {
    toggleTema();
  }
});


/* =========================================================
   MODUL 5 — Validasi Form (tetap berlaku)
   ========================================================= */

const inputNama = document.querySelector("#input-nama");
if (inputNama) {
  inputNama.addEventListener("input", () => {
    if (inputNama.validity.valueMissing) {
      inputNama.setCustomValidity("Nama wajib diisi");
    } else if (inputNama.validity.tooShort) {
      inputNama.setCustomValidity("Nama minimal 3 karakter");
    } else {
      inputNama.setCustomValidity("");
    }
  });
}

const inputPesan = document.querySelector("#input-pesan");
if (inputPesan) {
  inputPesan.addEventListener("input", () => {
    if (inputPesan.validity.valueMissing) {
      inputPesan.setCustomValidity("Komentar wajib diisi");
    } else if (inputPesan.validity.tooShort) {
      inputPesan.setCustomValidity("Komentar minimal 5 karakter");
    } else {
      inputPesan.setCustomValidity("");
    }
  });
}

const formDaftar = document.querySelector("#form-daftar");
const errorKonfirmasi = document.querySelector("#error-konfirmasi");
if (formDaftar && errorKonfirmasi) {
  formDaftar.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.querySelector("#password").value;
    const konfirmasi = document.querySelector("#konfirmasi").value;
    if (password !== konfirmasi) {
      errorKonfirmasi.textContent = "Konfirmasi password tidak sama dengan password";
    } else {
      errorKonfirmasi.textContent = "";
      alert("Pendaftaran berhasil (simulasi)!");
      formDaftar.reset();
    }
  });
}

function validasiField(input, errorElement) {
  if (!input.checkValidity()) {
    errorElement.textContent = input.validationMessage;
  } else {
    errorElement.textContent = "";
  }
}
[
  ["#username", "#error-username"],
  ["#email", "#error-email"],
  ["#password", "#error-password"],
].forEach(([fieldSel, errorSel]) => {
  const field = document.querySelector(fieldSel);
  const errEl = document.querySelector(errorSel);
  if (field && errEl) {
    field.addEventListener("input", () => validasiField(field, errEl));
  }
});


/* =========================================================
   MODUL 6 · B.6 — Tombol Reset seluruh data tersimpan
   ========================================================= */
const tombolReset = document.querySelector("#btn-reset");
if (tombolReset) {
  tombolReset.addEventListener("click", () => {
    const konfirmasi = confirm("Hapus semua data tersimpan (tema, like, komentar)?");
    if (konfirmasi) {
      localStorage.clear();
      location.reload();
    }
  });
}