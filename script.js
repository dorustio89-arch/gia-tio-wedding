// URL Web App Google Apps Script yang digunakan untuk RSVP
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbyWPcT5Dr3KIr6v7517E4ypyEeJPuHWBKYAUrbBNyUiVRTL9hU8bIV6b8mR9FpCiXBM/exec";


// =====================================
// DOA & UCAPAN
// =====================================

function loadWishes() {
    const container = document.getElementById("wishesList");

    if (!container) return;

    if (!RSVP_ENDPOINT || RSVP_ENDPOINT === "URL_WEB_APP_KAMU") {
        container.innerHTML = "<p>Ucapan belum terhubung.</p>";
        return;
    }

    container.innerHTML = "<p>Memuat doa dan ucapan...</p>";

    const callbackName = "renderWishes_" + Date.now();

    window[callbackName] = function(data) {
        const wishes = Array.isArray(data)
            ? data.filter(item =>
                item.ucapan && String(item.ucapan).trim() !== ""
            )
            : [];

        if (wishes.length === 0) {
            container.innerHTML =
                "<p>Belum ada ucapan. Jadilah yang pertama memberikan doa!</p>";
        } else {
            container.innerHTML = wishes.reverse().map(item => `
                <div class="wish-card">
                    <h4>${escapeHTML(item.nama || "Tamu Undangan")}</h4>
                    <p>${escapeHTML(item.ucapan)}</p>
                    <small>${escapeHTML(item.kehadiran || "")}</small>
                </div>
            `).join("");
        }

        delete window[callbackName];
        script.remove();
    };

    const script = document.createElement("script");

    script.src = RSVP_ENDPOINT + "?callback=" + callbackName;

    script.onerror = function() {
        container.innerHTML =
            "<p>Doa dan ucapan belum dapat dimuat. Silakan coba kembali.</p>";

        delete window[callbackName];
        script.remove();
    };

    document.body.appendChild(script);
}


// Mengamankan teks yang ditampilkan dari Spreadsheet
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


// =====================================
// OPEN INVITATION & MUSIC
// =====================================

const opening = document.getElementById("opening");
const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");

document.getElementById("openInvitation").addEventListener("click", async () => {

    opening.classList.add("hide");

    musicButton.style.display = "block";

    try {
        await music.play();
        musicButton.textContent = "Ⅱ";
    } catch (e) {
        musicButton.textContent = "♫";
    }

    // Animasi teks hero dimulai ketika undangan dibuka
    document.getElementById("home").classList.add("hero-animate");

    document.getElementById("home").scrollIntoView({
        behavior: "smooth"
    });

});


// Tombol musik
musicButton.addEventListener("click", async () => {

    if (music.paused) {
        try {
            await music.play();
            musicButton.textContent = "Ⅱ";
        } catch (e) {
            musicButton.textContent = "♫";
        }
    } else {
        music.pause();
        musicButton.textContent = "♫";
    }

});


// =====================================
// COUNTDOWN
// =====================================

function countdown() {

    const target = new Date("2027-01-17T09:00:00+07:00").getTime();

    const diff = Math.max(0, target - Date.now());

    const values = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60
    };

    Object.entries(values).forEach(([key, value]) => {
        const element = document.getElementById(key);

        if (element) {
            element.textContent = String(value).padStart(
                key === "days" ? 3 : 2,
                "0"
            );
        }
    });

}

countdown();
setInterval(countdown, 1000);


// ANIMASI SELURUH TEXT WEBSITE
// =====================================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});

document.querySelectorAll(".reveal, .reveal-text").forEach(el => {
    observer.observe(el);
});


// =====================================
// GALLERY LIGHTBOX
// =====================================

const lightbox = document.getElementById("lightbox");
const largePhoto = document.getElementById("largePhoto");

document.querySelectorAll(".gallery img").forEach(img => {

    img.addEventListener("click", () => {

        largePhoto.src = img.src;
        largePhoto.alt = img.alt;

        lightbox.classList.add("show");

    });

});


document.getElementById("closeLightbox").addEventListener("click", () => {
    lightbox.classList.remove("show");
});


lightbox.addEventListener("click", e => {

    if (e.target === lightbox) {
        lightbox.classList.remove("show");
    }

});


document.addEventListener("keydown", e => {

    if (e.key === "Escape") {
        lightbox.classList.remove("show");
    }

});


// =====================================
// FORM RSVP
// =====================================

document.getElementById("rsvpForm").addEventListener("submit", async e => {

    e.preventDefault();

    const status = document.getElementById("formStatus");

    if (!RSVP_ENDPOINT || RSVP_ENDPOINT === "URL_WEB_APP_KAMU") {

        status.textContent =
            "RSVP belum tersambung. Masukkan URL Google Apps Script terlebih dahulu.";

        return;

    }

    status.textContent = "Mengirim konfirmasi...";

    try {

        await fetch(RSVP_ENDPOINT, {
            method: "POST",
            mode: "no-cors",
            body: new URLSearchParams(new FormData(e.target))
        });

        status.textContent =
            "Terima kasih. Konfirmasi Anda telah dikirim.";

        e.target.reset();

    } catch (err) {

        status.textContent =
            "Pengiriman gagal. Silakan coba kembali.";

    }

});


// =====================================
// LOAD DOA & UCAPAN
// =====================================

document.addEventListener("DOMContentLoaded", loadWishes);

/* =================================
   ANIMASI MESIN TIK (TYPEWRITER)
================================= */
/* =================================
   ANIMASI MESIN TIK (MENDUKUNG <br>)
================================= */
document.addEventListener("DOMContentLoaded", () => {
    const elemenKetik = document.querySelectorAll(".typewriter-text");

    elemenKetik.forEach((el) => {
        el.dataset.originalHtml = el.innerHTML.trim();
        el.innerHTML = "";
        el.classList.add("menunggu");
    });

    const observerKetik = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.dataset.typed) {
                entry.target.dataset.typed = "true";
                const el = entry.target;
                const htmlAsli = el.dataset.originalHtml;
                const jeda = parseInt(el.dataset.delay) || 0;
                const kecepatan = parseInt(el.dataset.speed) || 45;

                setTimeout(() => {
                    el.classList.remove("menunggu");
                    let i = 0;
                    const interval = setInterval(() => {
                        if (htmlAsli.charAt(i) === "<") {
                            const penutupTag = htmlAsli.indexOf(">", i);
                            if (penutupTag !== -1) {
                                i = penutupTag + 1;
                            }
                        } else if (htmlAsli.substr(i, 5) === "&amp;") {
                            i += 5;
                        } else {
                            i++;
                        }

                        el.innerHTML = htmlAsli.slice(0, i);

                        if (i >= htmlAsli.length) {
                            clearInterval(interval);
                            el.classList.add("selesai");
                        }
                    }, kecepatan);
                }, jeda);
            }
        });
    }, { threshold: 0.2 });

    elemenKetik.forEach((el) => observerKetik.observe(el));
});

/* =================================
   FUNGSI SALIN NOMOR REKENING
================================= */
function copyText(elementId, btnElement) {
    const target = document.getElementById(elementId);
    if (!target) return;

    const nomorRekening = target.innerText.trim();

    // Metode modern (HTTPS / localhost)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(nomorRekening).then(() => {
            ubahTeksTombol(btnElement);
        }).catch(() => {
            salinCadangan(nomorRekening, btnElement);
        });
    } else {
        // Metode cadangan (jika dibuka langsung via file:// atau browser lama)
        salinCadangan(nomorRekening, btnElement);
    }
}

function salinCadangan(teks, btnElement) {
    const tempInput = document.createElement("textarea");
    tempInput.value = teks;
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();

    try {
        document.execCommand("copy");
        ubahTeksTombol(btnElement);
    } catch (err) {
        alert("Gagal menyalin otomatis. Silakan salin manual: " + teks);
    }

    document.body.removeChild(tempInput);
}

function ubahTeksTombol(btn) {
    if (!btn) return;
    const teksAsli = btn.innerText;
    btn.innerText = "✓ BERHASIL DISALIN";
    btn.style.background = "#594a40";
    btn.style.color = "#fff";

    setTimeout(() => {
        btn.innerText = teksAsli;
        btn.style.background = "";
        btn.style.color = "";
    }, 2000);
}

/* =================================
   NAMA TAMU UNDANGAN (?to=Nama)
================================= */
document.addEventListener("DOMContentLoaded", () => {
  const rawQuery = window.location.search;
  let namaTamu = "";

  if (rawQuery.includes("to=")) {
    const ambilSetelahTo = rawQuery.split("to=")[1].split("&fbclid=")[0].split("&utm_")[0];
    namaTamu = decodeURIComponent(ambilSetelahTo.replace(/\+/g, " "));
  }

  if (namaTamu && namaTamu.trim() !== "") {
    const namaBersih = namaTamu.trim();


        // 1. Ganti teks "Bapak/Ibu/Saudara/i" di halaman pembuka
        const guestEl = document.getElementById("guestName");
        if (guestEl) {
            guestEl.textContent = namaBersih;
        }

        // 2. Otomatis isi kolom input Nama di Form RSVP
        const inputNama = document.querySelector('form input[name="nama"], form input[name="Nama"]');
        if (inputNama) {
            inputNama.value = namaBersih;
        }
    }
});

