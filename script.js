/*
  PERSONALISASI WEBSITE:
  1. Ganti birthdayDate dengan tanggal ulang tahun yang dituju.
     Format: "YYYY-MM-DDTHH:MM:SS+07:00"
  2. Ubah teks surat langsung di index.html.
  3. Ganti foto di folder assets: photo1.jpg, photo2.jpg, photo3.jpg.
  4. Tambahkan musik milikmu sendiri sebagai assets/music.mp3.
*/

const birthdayDate = "2026-10-28T00:00:00+07:00"; // GANTI dengan tanggal ulang tahun yang benar.

const byId = (id) => document.getElementById(id);
const audio = byId("birthdayMusic");
const musicToggle = byId("musicToggle");
const musicLabel = byId("musicLabel");
const countdownMessage = byId("countdownMessage");
let musicPlaying = false;

// Foto tetap terlihat rapi jika file foto belum ditambahkan.
document.querySelectorAll(".photo-frame img").forEach((img) => {
  const frame = img.closest(".photo-frame");
  img.addEventListener("load", () => {
    img.classList.add("loaded");
    const placeholder = frame.querySelector(".photo-placeholder");
    if (placeholder) placeholder.hidden = true;
  });
  img.addEventListener("error", () => {
    img.classList.remove("loaded");
    img.hidden = true;
  });
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add("loaded");
    const placeholder = frame.querySelector(".photo-placeholder");
    if (placeholder) placeholder.hidden = true;
  }
});

// Hitung mundur berdasarkan tanggal yang diatur di atas.
function updateCountdown() {
  const target = new Date(birthdayDate).getTime();
  if (Number.isNaN(target)) {
    countdownMessage.textContent = "Periksa format tanggal ulang tahun di script.js.";
    return;
  }

  const now = Date.now();
  let difference = target - now;

  if (difference <= 0) {
    byId("days").textContent = "00";
    byId("hours").textContent = "00";
    byId("minutes").textContent = "00";
    byId("seconds").textContent = "00";
    countdownMessage.textContent = "Hari spesialmu sudah tiba. Selamat ulang tahun! ♡";
    return;
  }

  const day = Math.floor(difference / 86400000);
  difference %= 86400000;
  const hour = Math.floor(difference / 3600000);
  difference %= 3600000;
  const minute = Math.floor(difference / 60000);
  const second = Math.floor((difference % 60000) / 1000);

  byId("days").textContent = String(day).padStart(2, "0");
  byId("hours").textContent = String(hour).padStart(2, "0");
  byId("minutes").textContent = String(minute).padStart(2, "0");
  byId("seconds").textContent = String(second).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Browser biasanya memblokir autoplay. Musik baru diputar setelah tombol ditekan.
musicToggle.addEventListener("click", async () => {
  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
    musicLabel.textContent = "Putar musik";
    musicToggle.classList.remove("is-playing");
    musicToggle.setAttribute("aria-pressed", "false");
    return;
  }

  try {
    await audio.play();
    musicPlaying = true;
    musicLabel.textContent = "Jeda musik";
    musicToggle.classList.add("is-playing");
    musicToggle.setAttribute("aria-pressed", "true");
  } catch (error) {
    musicLabel.textContent = "Tambahkan music.mp3";
    console.warn("Musik belum bisa diputar. Pastikan assets/music.mp3 tersedia.", error);
  }
});

audio.addEventListener("ended", () => {
  musicPlaying = false;
  musicLabel.textContent = "Putar musik";
  musicToggle.classList.remove("is-playing");
  musicToggle.setAttribute("aria-pressed", "false");
});

// Interaksi lilin kue.
byId("blowCandle").addEventListener("click", () => {
  const scene = byId("cakeScene");
  const button = byId("blowCandle");
  const feedback = byId("cakeFeedback");
  const isBlown = scene.classList.toggle("blown");

  if (isBlown) {
    button.textContent = "Nyalakan lilin lagi";
    feedback.textContent = "Harapannya sudah dikirim ke semesta. Semoga satu per satu jadi nyata. ✨";
    launchConfetti(28);
  } else {
    button.textContent = "Tiup lilinnya ♡";
    feedback.textContent = "Semoga harapan baikmu menemukan jalannya.";
  }
});

// Kejutan dan confetti.
byId("surpriseButton").addEventListener("click", () => {
  const message = byId("surpriseMessage");
  const button = byId("surpriseButton");
  const willOpen = message.hidden;
  message.hidden = !willOpen;
  button.innerHTML = willOpen ? "Tutup kejutan <span>♡</span>" : "Buka kejutanmu <span>♡</span>";
  if (willOpen) {
    launchConfetti(65);
    message.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

function launchConfetti(amount) {
  const area = byId("confettiArea");
  const colors = ["#c7a56a", "#d6a6ad", "#f8f1e8", "#a65e70", "#e7c6a5"];
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    area.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}
