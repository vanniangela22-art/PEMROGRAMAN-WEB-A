// Tugas Praktikum Mandiri B.7 - Konsumsi REST API
// Fitur komentar: kirim (POST), edit (PATCH), hapus (DELETE) + like (PATCH)

const API_URL = "https://jsonplaceholder.typicode.com";

// ambil elemen dari html
const formKomentar = document.getElementById("formKomentar");
const inputNama = document.getElementById("inputNama");
const inputPesan = document.getElementById("inputPesan");
const tombolKirim = document.getElementById("tombolKirim");
const tombolBatal = document.getElementById("tombolBatal");
const daftarKomentar = document.getElementById("daftarKomentar");
const tombolLike = document.getElementById("tombolLike");
const jumlahLikeEl = document.getElementById("jumlahLike");

// null = form lagi mode kirim komentar baru
// kalau isinya <li>, berarti lagi mengedit komentar itu
let liEdit = null;
let jumlahLike = 0;

// ---------- fungsi bantu ----------

function pesanDariStatus(status) {
  if (status === undefined) return "Tidak bisa terhubung ke server.";
  if (status === 404) return "Data tidak ditemukan di server.";
  if (status === 400) return "Data yang dikirim tidak valid.";
  if (status >= 500) return "Server sedang bermasalah, coba lagi nanti.";
  return "Terjadi kesalahan tidak terduga.";
}

// kalau response tidak ok, lempar error yang membawa status code-nya
// supaya bisa dibaca di catch dan dipakai pesanDariStatus()
function cekResponse(response) {
  if (!response.ok) {
    const error = new Error("Request gagal, status: " + response.status);
    error.status = response.status;
    throw error;
  }
}

// indikator loading: tombol dinonaktifkan sementara dan teksnya diganti
function aturLoading(tombol, aktif, teksLoading, teksNormal) {
  tombol.disabled = aktif;
  tombol.textContent = aktif ? teksLoading : teksNormal;
}

function resetForm() {
  formKomentar.reset();
  liEdit = null;
  tombolKirim.textContent = "Kirim Komentar";
  tombolBatal.hidden = true;
}

// ---------- request ke server ----------

async function kirimKomentarKeServer(nama, pesan) {
  const response = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nama, body: pesan, postId: 1 }),
  });
  cekResponse(response);
  return await response.json();
}

async function editKomentarKeServer(id, nama, pesan) {
  const response = await fetch(`${API_URL}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nama, body: pesan }),
  });
  cekResponse(response);
  return await response.json();
}

async function hapusKomentarDiServer(id) {
  const response = await fetch(`${API_URL}/comments/${id}`, {
    method: "DELETE",
  });
  cekResponse(response);
}

async function perbaruiLikeKeServer(jumlah) {
  const response = await fetch(`${API_URL}/posts/1`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: jumlah }),
  });
  cekResponse(response);
}

// ---------- tampilan komentar ----------

function buatItemKomentar(data) {
  const li = document.createElement("li");
  li.dataset.id = data.id; // id dari server
  li.dataset.nama = data.name;
  li.dataset.pesan = data.body;

  const teks = document.createElement("span");
  teks.className = "teks-komentar";
  teks.textContent = `${data.name}: ${data.body}`;

  const tombolEdit = document.createElement("button");
  tombolEdit.textContent = "Edit";
  tombolEdit.className = "tombol-edit";

  const tombolHapus = document.createElement("button");
  tombolHapus.textContent = "Hapus";
  tombolHapus.className = "tombol-hapus";

  li.appendChild(teks);
  li.appendChild(tombolEdit);
  li.appendChild(tombolHapus);
  return li;
}

// ambil beberapa komentar awal dari server (GET)
async function ambilKomentarAwal() {
  try {
    const response = await fetch(`${API_URL}/posts/1/comments`);
    cekResponse(response);
    const data = await response.json();
    data.slice(0, 3).forEach((komentar) => {
      daftarKomentar.appendChild(buatItemKomentar(komentar));
    });
  } catch (error) {
    alert(pesanDariStatus(error.status));
    console.error(error);
  }
}

// ---------- event ----------

// kirim komentar baru (POST) atau simpan hasil edit (PATCH)
formKomentar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = inputNama.value.trim();
  const pesan = inputPesan.value.trim();
  if (nama === "" || pesan === "") {
    alert("Nama dan komentar tidak boleh kosong.");
    return;
  }

  aturLoading(tombolKirim, true, "Mengirim...", "");
  try {
    if (liEdit === null) {
      const hasil = await kirimKomentarKeServer(nama, pesan);
      daftarKomentar.appendChild(buatItemKomentar(hasil));
    } else {
      const hasil = await editKomentarKeServer(liEdit.dataset.id, nama, pesan);
      liEdit.dataset.nama = hasil.name;
      liEdit.dataset.pesan = hasil.body;
      liEdit.querySelector(".teks-komentar").textContent = `${hasil.name}: ${hasil.body}`;
    }
    resetForm();
  } catch (error) {
    alert(pesanDariStatus(error.status));
    console.error(error);
  } finally {
    aturLoading(tombolKirim, false, "", liEdit === null ? "Kirim Komentar" : "Simpan Perubahan");
  }
});

tombolBatal.addEventListener("click", resetForm);

// tombol Edit dan Hapus pakai event delegation
daftarKomentar.addEventListener("click", async (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  // Edit: tampilkan lagi isi komentar ke form
  if (e.target.classList.contains("tombol-edit")) {
    liEdit = li;
    inputNama.value = li.dataset.nama;
    inputPesan.value = li.dataset.pesan;
    tombolKirim.textContent = "Simpan Perubahan";
    tombolBatal.hidden = false;
    inputPesan.focus();
  }

  // Hapus (DELETE)
  if (e.target.classList.contains("tombol-hapus")) {
    const tombol = e.target;
    aturLoading(tombol, true, "Menghapus...", "Hapus");
    try {
      await hapusKomentarDiServer(li.dataset.id);
      if (liEdit === li) resetForm(); // komentar yang lagi diedit ikut terhapus
      li.remove();
    } catch (error) {
      alert(pesanDariStatus(error.status));
      console.error(error);
    } finally {
      aturLoading(tombol, false, "", "Hapus");
    }
  }
});

// like (PATCH)
tombolLike.addEventListener("click", async () => {
  tombolLike.disabled = true;
  try {
    await perbaruiLikeKeServer(jumlahLike + 1);
    jumlahLike++;
    jumlahLikeEl.textContent = jumlahLike;
  } catch (error) {
    alert(pesanDariStatus(error.status));
    console.error(error);
  } finally {
    tombolLike.disabled = false;
  }
});

ambilKomentarAwal();