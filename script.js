/* ================================================
   THIỆP MỜI TỐT NGHIỆP - script.js
   ================================================ */

// ================================================
// CẤU HÌNH - Chỉnh sửa tại đây cho phù hợp
// ================================================
const CONFIG = {
  // Ngày giờ sự kiện (năm, tháng-1, ngày, giờ, phút)
  eventDate: new Date(2025, 7, 16, 17, 30, 0), // 16/08/2025 lúc 17:30
 

  // Key lưu localStorage
  storageKey_wishes: "graduation_wishes",
  storageKey_rsvp:   "graduation_rsvp",

  // ⬇⬇ DÁN URL GOOGLE APPS SCRIPT VÀO ĐÂY sau khi deploy ⬇⬇
  // Hướng dẫn lấy URL ở file HUONG-DAN-SETUP.md
  sheetsWebAppUrl: "https://script.google.com/macros/s/AKfycbyPFrCtVIV10tzHfauGsKbT7sUxqS8mcYJNzwSvOmjHNo6HSQTBAks_xtVQVnYmvX-J/exec",   // Ví dụ: "https://script.google.com/macros/s/AKfyc.../exec"
};

// ================================================
// GOOGLE SHEETS - Gửi dữ liệu lên Sheets
// ================================================
function sendToSheet(payload) {
  if (!CONFIG.sheetsWebAppUrl) return; // chưa cấu hình URL thì bỏ qua

  fetch(CONFIG.sheetsWebAppUrl, {
    method: "POST",
    mode:   "no-cors",   // Apps Script không hỗ trợ CORS nên dùng no-cors
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Lỗi mạng — đã có localStorage làm backup, không cần báo lỗi người dùng
  });
}

// ================================================
// KHỞI TẠO KHI TRANG TẢI
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  createParticles();
  startCountdown();
  initMusicState();
  initCharCounter();
});

// ================================================
// TAB NAVIGATION
// ================================================
function switchTab(index) {
  // Ẩn tất cả panels
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.remove("active");
  });

  // Bỏ active tất cả tab buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // Hiện panel được chọn
  const targetPanel = document.querySelector(`.tab-panel[data-panel="${index}"]`);
  if (targetPanel) targetPanel.classList.add("active");

  // Active tab button tương ứng
  const targetBtn = document.querySelector(`.tab-btn[data-tab="${index}"]`);
  if (targetBtn) targetBtn.classList.add("active");

  // Scroll lên đầu thiệp
  const cardWrapper = document.getElementById("cardWrapper");
  if (cardWrapper) {
    cardWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  // Thêm đoạn này vào trong hàm switchTab(index) của bạn:
if (index === 3) {
  const rsvpNameInput = document.getElementById("rsvpName");
  const wishNameInput = document.getElementById("wishName");
  const greeting = document.getElementById("greetingWishName");
  
  if (rsvpNameInput && wishNameInput) {
    const enteredName = rsvpNameInput.value.trim();
    wishNameInput.value = enteredName; // Gán tên ngầm vào ô gửi
    
    if (greeting && enteredName) {
      greeting.innerHTML = `Gửi lời chúc từ bạn: <span style="color: #2563eb;">${enteredName}</span> 🌟`;
    }
  }
}
}

// ================================================
// PARTICLES - Bong bóng + Hoa + Hello Kitty
// ================================================
function createParticles() {
  const container = document.getElementById("particles");
  const isMobile  = window.innerWidth < 480;

  // ---- 1. Bong bóng tròn ----
  const bubbleColors = [
    "rgba(126,200,227,0.55)",
    "rgba(184,223,240,0.65)",
    "rgba(74,168,200,0.45)",
    "rgba(255,255,255,0.75)",
    "rgba(255,192,203,0.5)",   // hồng nhạt
    "rgba(200,232,245,0.6)",
  ];
  const bubbleCount = isMobile ? 16 : 26;

  for (let i = 0; i < bubbleCount; i++) {
    const p    = document.createElement("div");
    p.className = "particle bubble";
    const size = Math.random() * 18 + 6;
    p.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      background: ${bubbleColors[Math.floor(Math.random() * bubbleColors.length)]};
      --dur:   ${Math.random() * 10 + 8}s;
      --delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }

  // ---- 2. Hoa rơi ----
  const flowers  = ["🌸", "🌺", "🌼", "🌷", "💮", "🌻"];
  const flowerCount = isMobile ? 10 : 16;

  for (let i = 0; i < flowerCount; i++) {
    const f = document.createElement("div");
    f.className = "particle flower";
    const size = Math.random() * 14 + 14; // 14–28px
    const emoji = flowers[Math.floor(Math.random() * flowers.length)];
    f.textContent = emoji;
    f.style.cssText = `
      font-size: ${size}px;
      left:   ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      --dur:   ${Math.random() * 12 + 10}s;
      --delay: ${Math.random() * 12}s;
      --sway:  ${(Math.random() - 0.5) * 60}px;
    `;
    container.appendChild(f);
  }

  // ---- 3. Hello Kitty ----
  const kittyCount = isMobile ? 4 : 7;

  for (let i = 0; i < kittyCount; i++) {
    const k = document.createElement("div");
    k.className = "particle kitty";
    const size = Math.random() * 12 + 20; // 20–32px
    k.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
      width="${size}" height="${size}" style="display:block">
      <!-- Tai trái -->
      <polygon points="10,40 22,10 35,38" fill="#fff" stroke="#ffb7c5" stroke-width="3"/>
      <!-- Tai phải -->
      <polygon points="65,38 78,10 90,40" fill="#fff" stroke="#ffb7c5" stroke-width="3"/>
      <!-- Nơ tai trái -->
      <path d="M14,30 Q22,22 18,14 Q26,20 22,30Z" fill="#ff6b8a" opacity="0.85"/>
      <!-- Mặt -->
      <ellipse cx="50" cy="58" rx="38" ry="36" fill="#fff" stroke="#ffb7c5" stroke-width="2.5"/>
      <!-- Mắt trái -->
      <ellipse cx="37" cy="52" rx="4.5" ry="5" fill="#333"/>
      <circle cx="38.5" cy="50.5" r="1.5" fill="#fff"/>
      <!-- Mắt phải -->
      <ellipse cx="63" cy="52" rx="4.5" ry="5" fill="#333"/>
      <circle cx="64.5" cy="50.5" r="1.5" fill="#fff"/>
      <!-- Mũi -->
      <ellipse cx="50" cy="60" rx="3" ry="2" fill="#ff9db5"/>
      <!-- Râu trái -->
      <line x1="12" y1="60" x2="43" y2="62" stroke="#bbb" stroke-width="1.8"/>
      <line x1="12" y1="66" x2="43" y2="65" stroke="#bbb" stroke-width="1.8"/>
      <!-- Râu phải -->
      <line x1="57" y1="62" x2="88" y2="60" stroke="#bbb" stroke-width="1.8"/>
      <line x1="57" y1="65" x2="88" y2="66" stroke="#bbb" stroke-width="1.8"/>
      <!-- Nơ đầu -->
      <path d="M44,26 Q50,18 56,26 Q50,22 44,26Z" fill="#ff6b8a"/>
      <path d="M44,26 Q38,20 42,14 Q50,20 44,26Z" fill="#ff6b8a"/>
      <path d="M56,26 Q58,14 66,16 Q62,22 56,26Z" fill="#ff6b8a"/>
      <circle cx="50" cy="25" r="4" fill="#ff3d6b"/>
    </svg>`;
    k.style.cssText = `
      left:   ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      --dur:   ${Math.random() * 14 + 12}s;
      --delay: ${Math.random() * 14}s;
      --sway:  ${(Math.random() - 0.5) * 80}px;
      opacity: 0;
    `;
    container.appendChild(k);
  }
}

// ================================================
// MỞ THIỆP - Animation
// ================================================
function openCard() {
  const cover = document.getElementById("coverPage");
  const card  = document.getElementById("cardWrapper");

  cover.classList.add("hide");

  setTimeout(() => {
    cover.style.display = "none";
    card.classList.add("visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Tự động phát nhạc khi mở thiệp
    autoPlayMusic();
  }, 750);
}

// ================================================
// ĐÓNG THIỆP - Quay về bìa
// ================================================
function closeCard() {
  const cover = document.getElementById("coverPage");
  const card  = document.getElementById("cardWrapper");

  card.classList.remove("visible");
  cover.style.display = "flex";

  // Chờ 1 frame rồi mới xóa class hide để animation chạy lại
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cover.classList.remove("hide");
    });
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ================================================
// NHẠC NỀN
// ================================================
let musicPlaying = false;

function initMusicState() {
  const audio = document.getElementById("bgMusic");
  audio.volume = 0.45;
  updateMusicIcons(false);
}

function autoPlayMusic() {
  const audio = document.getElementById("bgMusic");
  audio.play()
    .then(() => {
      musicPlaying = true;
      updateMusicIcons(true);
    })
    .catch(() => {
      // Trình duyệt chặn autoplay - chờ người dùng bấm
      musicPlaying = false;
      updateMusicIcons(false);
    });
}

function toggleMusic() {
  const audio = document.getElementById("bgMusic");
  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
  } else {
    audio.play().catch(() => {});
    musicPlaying = true;
  }
  updateMusicIcons(musicPlaying);
}

function updateMusicIcons(isPlaying) {
  const ids = ["musicToggle", "musicToggleInside"];
  ids.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (isPlaying) {
      btn.classList.add("playing");
    } else {
      btn.classList.remove("playing");
    }
  });

  const iconIds = ["musicIcon", "musicIconInside"];
  iconIds.forEach(id => {
    const icon = document.getElementById(id);
    if (!icon) return;
    icon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-music";
  });
}

// ================================================
// ĐẾM NGƯỢC
// ================================================
function startCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now  = new Date();
  const diff = CONFIG.eventDate - now;

  if (diff <= 0) {
    // Sự kiện đã diễn ra
    setCountdownText("00", "00", "00", "00");
    document.querySelector(".countdown-label").textContent = "Sự kiện đã diễn ra 🎓";
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  setCountdownText(
    pad(days), pad(hours), pad(mins), pad(secs)
  );
}

function setCountdownText(d, h, m, s) {
  document.getElementById("cdDays").textContent  = d;
  document.getElementById("cdHours").textContent = h;
  document.getElementById("cdMins").textContent  = m;
  document.getElementById("cdSecs").textContent  = s;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// ================================================
// XÁC NHẬN THAM DỰ (RSVP)
// ================================================
function submitRSVP(answer) {
  const nameInput = document.getElementById("rsvpName");
  
  if (!nameInput) {
      console.error("Không tìm thấy ô nhập tên!");
      return;
  }
  
  const name = nameInput.value.trim();

  // Bắt buộc nhập tên
  if (!name) {
    shakeInput(nameInput);
    nameInput.placeholder = "Bạn chưa nhập tên kìa! 👇";
    setTimeout(() => nameInput.placeholder = "Tên của bạn...", 2500);
    return;
  }

  // Lưu vào localStorage (backup)
  const rsvpData = {
    name,
    answer,
    time: new Date().toLocaleString("vi-VN"),
  };
  const existing = JSON.parse(localStorage.getItem(CONFIG.storageKey_rsvp) || "[]");
  existing.push(rsvpData);
  localStorage.setItem(CONFIG.storageKey_rsvp, JSON.stringify(existing));

  // Gửi lên Google Sheets và Netlify (nếu có)
  if (typeof sendToSheet === "function") sendToSheet({ type: "rsvp", name, answer });

  // 1. Ẩn form xác nhận ban đầu
  const formCard = document.getElementById("rsvpFormCard");
  if (formCard) formCard.style.display = "none";

    // 2. Ghi đè nội dung, chèn TÊN NGƯỜI NHẬP và THÊM NÚT CHUYỂN TRANG
    if (answer === "yes") {
      const resultYes = document.getElementById("rsvpResultYes");
      if (resultYes) {
          resultYes.innerHTML = `
              <div class="result-yes-content">
                <h2 class="result-yes-title">🎓 Cảm ơn ${escapeHtml(name)}! 💗</h2>
                <p class="result-yes-sub"><strong>Ngọc</strong> đã nhận được xác nhận tham dự của ${escapeHtml(name)} rồi.</p>
                <div class="result-divider"></div>
                <p class="result-yes-text">
                    Cảm ơn ${escapeHtml(name)} đã dành thời gian đến chung vui trong ngày đặc biệt này. Sự có mặt của ${escapeHtml(name)} sẽ là niềm vui và món quà ý nghĩa nhất đối với <strong>Ngọc</strong>.
                </p>
                <div class="result-divider"></div>
                <h3 class="result-yes-footer">Hẹn gặp ${escapeHtml(name)} tại buổi tiệc<br>tốt nghiệp nhé! 💖</h3>
                
                <!-- NÚT CHUYỂN SANG TRANG LỜI CHÚC -->
                <button class="tab-next-btn" style="margin-top: 25px;" onclick="switchTab(3)">
                    Gửi lời chúc cho Ngọc 💌 <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `;
        resultYes.style.display = "block";
    }
    
    // Bắn pháo hoa ăn mừng
    if (typeof launchConfetti === "function") launchConfetti(); 
  } else {
    const resultNo = document.getElementById("rsvpResultNo");
    if (resultNo) {
        resultNo.innerHTML = `
            <h2 class="result-no-title">💗 Cảm ơn ${escapeHtml(name)}!</h2>
            <p class="result-no-sub">Ngọc đã nhận được phản hồi của ${escapeHtml(name)} rồi.</p>
            <p class="result-no-text">
                Dù ${escapeHtml(name)} không thể tham dự, Ngọc vẫn rất cảm ơn vì ${escapeHtml(name)} đã dành thời gian xác nhận. Hy vọng sẽ sớm có dịp gặp ${escapeHtml(name)} và chia sẻ niềm vui cùng nhau trong một dịp gần nhất.
            </p>
            <p class="result-no-text">
                Chúc ${escapeHtml(name)} thật nhiều sức khỏe và những điều tốt đẹp nhé! 🌸
            </p>
            
            <!-- NÚT CHUYỂN SANG TRANG LỜI CHÚC -->
            <button class="tab-next-btn" style="margin-top: 25px;" onclick="switchTab(3)">
                Gửi lời chúc cho Ngọc 💌 <i class="fa-solid fa-arrow-right"></i>
            </button>
        `;
        resultNo.style.display = "block";
    }
  }
  }

// ================================================
// GỬI LỜI CHÚC
// ================================================
function initCharCounter() {
  const textarea = document.getElementById("wishText");
  const charCount = document.getElementById("charCount");
  
  if (!textarea || !charCount) return;

  // Lắng nghe sự kiện gõ phím
  textarea.addEventListener("input", () => {
    charCount.textContent = textarea.value.length;
  });
}

function sendWish() {
  const nameInput = document.getElementById("wishName");
  const textInput = document.getElementById("wishText");
  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  // Kiểm tra nhập tên
  if (!name) {
    if (typeof shakeInput === "function") shakeInput(nameInput);
    nameInput.placeholder = "Bạn chưa nhập tên kìa! 👇";
    setTimeout(() => nameInput.placeholder = "Tên của bạn...", 2500);
    return;
  }
  
  // Kiểm tra nhập lời chúc
  if (!text) {
    if (typeof shakeInput === "function") shakeInput(textInput);
    textInput.placeholder = "Bạn chưa viết lời chúc kìa! 💌";
    setTimeout(() => textInput.placeholder = "Viết lời chúc của bạn tại đây... 🌸", 2500);
    return;
  }

  // 1. ÉP BUỘC CHUYỂN GIAO DIỆN NGAY LẬP TỨC (Đặt lên đầu tiên)
  const wishForm = document.getElementById("wishForm");
  const wishSent = document.getElementById("wishSent");
  
  if (wishForm) wishForm.style.display = "none";
  if (wishSent) wishSent.style.display = "block";

  // 2. Sau đó mới gọi gửi dữ liệu ngầm phía sau (dù có lỗi mạng cũng không làm đứng web)
  try {
    if (typeof sendToSheet === "function") {
      sendToSheet({ type: "wish", name, text });
    }
  } catch (err) {
    console.log("Lỗi gửi Sheet:", err);
  }

  try {
    if (typeof sendToNetlify === "function") {
      sendToNetlify("wish", { name, text });
    }
  } catch (err) {
    console.log("Lỗi gửi Netlify:", err);
  }
}

function goToMemory() {
  // 1. Reset lại form (đề phòng sau này quay lại gửi tiếp)
  const nameInput = document.getElementById("wishName");
  const textInput = document.getElementById("wishText");
  const charCount = document.getElementById("charCount");
  const wishForm = document.getElementById("wishForm");
  const wishSent = document.getElementById("wishSent");

  if (nameInput) nameInput.value = "";
  if (textInput) textInput.value = "";
  if (charCount) charCount.textContent = "0";
  if (wishForm) wishForm.style.display = "block";
  if (wishSent) wishSent.style.display = "none";

  // 2. Chuyển sang trang Kỷ Niệm (Panel 4) bằng hàm switchTab có sẵn
  if (typeof switchTab === "function") {
    switchTab(4);
  }
}


// ================================================
// CONFETTI NHỎ - Khi xác nhận tham dự
// ================================================
function launchConfetti() {
  const colors = ["#7ec8e3", "#b8dff0", "#4aa8c8", "#ffffff", "#ffd6e0", "#d4e8f5"];
  const count  = 60;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const dot = document.createElement("div");
      const size = Math.random() * 8 + 5;
      dot.style.cssText = `
        position: fixed;
        width:  ${size}px;
        height: ${size}px;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 1.5 + 1.2}s ease-in forwards;
      `;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 3000);
    }, i * 35);
  }

  // Keyframe confetti được inject 1 lần
  if (!document.getElementById("confettiStyle")) {
    const style = document.createElement("style");
    style.id = "confettiStyle";
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ================================================
// TIỆN ÍCH
// ================================================

// Shake animation khi input trống
function shakeInput(el) {
  el.style.animation = "none";
  el.offsetHeight; // reflow
  el.style.animation = "shakeIt 0.4s ease";
  // Inject keyframe 1 lần
  if (!document.getElementById("shakeStyle")) {
    const s = document.createElement("style");
    s.id = "shakeStyle";
    s.textContent = `
      @keyframes shakeIt {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-7px); }
        40%       { transform: translateX(7px); }
        60%       { transform: translateX(-5px); }
        80%       { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(s);
  }
  setTimeout(() => { el.style.animation = ""; }, 500);
}

// Escape HTML để tránh XSS
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ================================================
// HIỆU ỨNG LỜI CHÚC BAY LƠ LỬNG 
// ================================================
function startFloatingWishes() {
    const container = document.getElementById('floatingWishesContainer');
    if (!container) return;

    const wishes = [
        "Chúc Ngọc tốt nghiệp vui vẻ! 🎉",
        "Thành công trên con đường sắp tới nhé! ❤️",
        "Luôn xinh đẹp và hạnh phúc nha! 🌸",
        "Chúc mừng tân cử nhân! 🎓",
        "Mãi đỉnh nhé bạn tôi ơi! ✨",
        "Tương lai rực rỡ nhé Ngọc! 🌟"
    ];

    setInterval(() => {
        // Kiểm tra xem có đang mở trang Kỷ Niệm (Panel 4) không
        const panel4 = document.querySelector('.tab-panel[data-panel="4"]');
        
        if (!panel4 || !panel4.classList.contains('active')) {
            container.innerHTML = ''; 
            return; 
        }

        const wishEl = document.createElement('div');
        wishEl.className = 'floating-wish';
        wishEl.innerText = wishes[Math.floor(Math.random() * wishes.length)];
        
        // Random 2 bên: Trái (2% - 15%), Phải (70% - 85%)
        const isLeft = Math.random() > 0.5;
        const leftPosition = isLeft ? (Math.random() * 13 + 2) : (Math.random() * 15 + 70);
        wishEl.style.left = leftPosition + '%';
        
        // Kích thước ngẫu nhiên
        wishEl.style.fontSize = (Math.random() * 10 + 16) + 'px';
        
        // GẮN TRỰC TIẾP LỆNH BAY VÀO HTML (Đây là điểm mấu chốt để fix lỗi)
        const duration = Math.random() * 4 + 6;
        wishEl.style.animation = `floatUp ${duration}s linear forwards`;

        container.appendChild(wishEl);

        // Dọn rác sau khi chữ bay xong
        setTimeout(() => {
            if(wishEl.parentNode) {
                wishEl.remove();
            }
        }, duration * 1000);

    }, 1200); // 1.2 giây thả 1 câu cho nhiều
}

document.addEventListener("DOMContentLoaded", () => {
  initCharCounter();

  // --- HỆ THỐNG PHỤC KÍCH VÀ TIÊU DIỆT Ô XANH CHỨA DẤU ">" ---
  const observer = new MutationObserver(() => {
    document.querySelectorAll('div, button, span, a').forEach(el => {
      // Kiểm tra nếu phần tử có nội dung là dấu ">" (độc lập, không chứa thẻ con nào khác)
      if (el.innerText && el.innerText.trim() === '>' && el.children.length === 0) {
        el.remove(); // Xóa vĩnh viễn khỏi giao diện
      }
    });
  });

  // Bắt đầu theo dõi toàn bộ trang web
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Quét toàn bộ văn bản thuần túy trên trang để tìm và xóa ký tự '>' đứng độc lập
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while (node = walker.nextNode()) {
    if (node.nodeValue && node.nodeValue.trim() === '>') {
      node.nodeValue = ''; // Xóa nội dung ký tự '>' đi ngay lập tức
    }
  }
});