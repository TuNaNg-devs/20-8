/**
 * =========================================================================
 * 💙 CẤU HÌNH THÔNG TIN CHÚC MỪNG SINH NHẬT (BẠN CÓ THỂ CHỈNH SỬA TẠI ĐÂY) 💙
 * =========================================================================
 * Bạn có thể tự do thay đổi tên, ngày tháng, biệt danh và lời chúc bên dưới!
 */
const BIRTHDAY_CONFIG = {
  // Tên hoặc biệt danh của bạn gái
  girlfriendName: "Phạm Phúc Ngân",
  
  // Ngày sinh nhật
  birthdayDate: "Ngày đặc biệt nhất trong năm",
  
  // Tên / Ký tên của bạn
  senderName: "Người yêu em",

  // Đoạn lời chúc sinh nhật (Hỗ trợ xuống dòng)
  letterMessage: `Chúc mừng sinh nhật cô gái đáng yêu!🎂

Cảm ơn em đã xuất hiện và mang đến cho thế giới của anh vô vàn niềm vui.

Bước sang tuổi mới, chúc em luôn luôn xinh đẹp, rạng ngỡ, luôn giữ nụ cười hạnh phúc trên môi và mọi ước mơ của em đều sẽ trở thành hiện thực. Dù có chuyện gì xảy ra, anh vẫn sẽ luôn ở đây bên cạnh, yêu thương và đồng hành cùng em trên mọi chặng đường.

Chúc em một ngày sinh nhật ngập tràn hạnh phúc!`
};

/**
 * =========================================================================
 * ÂM NHẠC & HIỆU ỨNG ÂM THANH (WEB AUDIO API - KHÔNG CẦN FILE NGOÀI)
 * =========================================================================
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlayingMusic = false;
    this.isMuted = false;
    this.musicTimeout = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.4, time = 0, gainLevel = 0.15) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + time);
      
      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + time + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      
      osc.start(this.ctx.currentTime + time);
      osc.stop(this.ctx.currentTime + time + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playChime() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.8, idx * 0.1, 0.12);
    });
  }

  playCelebrationSound() {
    this.init();
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 1.2, idx * 0.08, 0.15);
    });
  }

  playHappyBirthday() {
    this.init();
    this.isPlayingMusic = true;

    // Happy Birthday notes (frequency in Hz)
    // "Happy Birthday to you, Happy Birthday to you, Happy Birthday dear [Name], Happy Birthday to you"
    const melody = [
      { note: 261.63, dur: 0.35, delay: 0.0 }, // C4
      { note: 261.63, dur: 0.25, delay: 0.4 }, // C4
      { note: 293.66, dur: 0.60, delay: 0.7 }, // D4
      { note: 261.63, dur: 0.60, delay: 1.4 }, // C4
      { note: 349.23, dur: 0.60, delay: 2.1 }, // F4
      { note: 329.63, dur: 1.00, delay: 2.8 }, // E4

      { note: 261.63, dur: 0.35, delay: 4.0 }, // C4
      { note: 261.63, dur: 0.25, delay: 4.4 }, // C4
      { note: 293.66, dur: 0.60, delay: 4.7 }, // D4
      { note: 261.63, dur: 0.60, delay: 5.4 }, // C4
      { note: 392.00, dur: 0.60, delay: 6.1 }, // G4
      { note: 349.23, dur: 1.00, delay: 6.8 }, // F4

      { note: 261.63, dur: 0.35, delay: 8.0 }, // C4
      { note: 261.63, dur: 0.25, delay: 8.4 }, // C4
      { note: 523.25, dur: 0.60, delay: 8.7 }, // C5
      { note: 440.00, dur: 0.60, delay: 9.4 }, // A4
      { note: 349.23, dur: 0.60, delay: 10.1 }, // F4
      { note: 329.63, dur: 0.60, delay: 10.8 }, // E4
      { note: 293.66, dur: 0.80, delay: 11.5 }, // D4

      { note: 466.16, dur: 0.35, delay: 12.6 }, // Bb4
      { note: 466.16, dur: 0.25, delay: 13.0 }, // Bb4
      { note: 440.00, dur: 0.60, delay: 13.3 }, // A4
      { note: 349.23, dur: 0.60, delay: 14.0 }, // F4
      { note: 392.00, dur: 0.60, delay: 14.7 }, // G4
      { note: 349.23, dur: 1.20, delay: 15.4 }, // F4
    ];

    melody.forEach(item => {
      this.playTone(item.note, 'triangle', item.dur, item.delay, 0.12);
      // Add subtle harmony
      this.playTone(item.note * 0.5, 'sine', item.dur, item.delay, 0.05);
    });

    // Loop after song finishes (~17s)
    this.musicTimeout = setTimeout(() => {
      if (this.isPlayingMusic) {
        this.playHappyBirthday();
      }
    }, 18000);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.init();
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

const audio = new SoundEngine();

/**
 * =========================================================================
 * HIỆU ỨNG NỀN CANVAS (BLUE PARTICLES & SHOOTING STARS & HEARTS)
 * =========================================================================
 */
class SkyCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.fireworks = [];
    this.width = 0;
    this.height = 0;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles(70);
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles(count) {
    const colors = ['#38bdf8', '#60a5fa', '#93c5fd', '#bfdbfe', '#ffffff', '#0284c7'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        pulsing: Math.random() * 0.02 + 0.01,
        type: Math.random() > 0.85 ? 'heart' : 'circle'
      });
    }
  }

  addExplosion(x, y, count = 45) {
    const colors = ['#38bdf8', '#60a5fa', '#3b82f6', '#93c5fd', '#ffffff', '#00f0ff'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 6 + 2;
      this.fireworks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.018 + 0.012,
        gravity: 0.08
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw background floating particles
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.pulsing;
      if (p.alpha > 0.95 || p.alpha < 0.2) p.pulsing = -p.pulsing;

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;

      if (p.type === 'heart') {
        this.drawHeart(p.x, p.y, p.radius * 2.2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    // Update & draw fireworks
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      let fw = this.fireworks[i];
      fw.x += fw.vx;
      fw.y += fw.vy;
      fw.vy += fw.gravity;
      fw.alpha -= fw.decay;

      if (fw.alpha <= 0) {
        this.fireworks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = fw.alpha;
      this.ctx.fillStyle = fw.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = fw.color;
      this.ctx.beginPath();
      this.ctx.arc(fw.x, fw.y, fw.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }

  drawHeart(x, y, size) {
    this.ctx.beginPath();
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(x, y + topCurveHeight);
    this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    this.ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
    this.ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    this.ctx.fill();
  }
}

/**
 * =========================================================================
 * KHỞI TẠO DOM & LOGIC TƯƠNG TÁC
 * =========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-canvas');
  const sky = new SkyCanvas(canvas);

  // Elements
  const startScreen = document.getElementById('start-screen');
  const mainScreen = document.getElementById('main-screen');
  const startBtn = document.getElementById('start-btn');
  const transitionCurtain = document.getElementById('transition-curtain');
  const burstCircle = document.getElementById('burst-circle');

  const gfNameEl = document.getElementById('gf-name');
  const birthdayDateEl = document.getElementById('birthday-date');
  const letterContentEl = document.getElementById('letter-content');
  const sigNameEl = document.getElementById('sig-name');

  // Controls
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const editModalBtn = document.getElementById('edit-modal-btn');
  const editModal = document.getElementById('edit-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const saveConfigBtn = document.getElementById('save-config-btn');
  const resetConfigBtn = document.getElementById('reset-config-btn');

  // Cake
  const cakeWrapper = document.getElementById('cake-wrapper');
  const candleFlame = document.getElementById('candle-flame');
  const candleSmoke = document.getElementById('candle-smoke');
  const candleHint = document.getElementById('candle-hint');

  // Input form fields
  const inputName = document.getElementById('input-name');
  const inputDate = document.getElementById('input-date');
  const inputSender = document.getElementById('input-sender');
  const inputMessage = document.getElementById('input-message');

  // State
  let currentConfig = { ...BIRTHDAY_CONFIG };
  let typewriterInterval = null;
  let isFlameBlown = false;

  // Render initial static info
  function populateConfigData() {
    gfNameEl.textContent = currentConfig.girlfriendName;
    birthdayDateEl.textContent = currentConfig.birthdayDate;
    sigNameEl.textContent = currentConfig.senderName;
  }

  populateConfigData();

  /**
   * TYPEWRITER EFFECT CHO LỜI CHÚC
   */
  function startTypewriter(text, targetEl, onComplete) {
    if (typewriterInterval) clearInterval(typewriterInterval);
    targetEl.innerHTML = '';
    
    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    targetEl.appendChild(cursor);

    let charIndex = 0;
    const speed = 35; // ms per char

    typewriterInterval = setInterval(() => {
      if (charIndex < text.length) {
        const char = text.charAt(charIndex);
        if (char === '\n') {
          targetEl.insertBefore(document.createElement('br'), cursor);
        } else {
          targetEl.insertBefore(document.createTextNode(char), cursor);
        }
        charIndex++;
      } else {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        if (onComplete) onComplete();
      }
    }, speed);
  }

  /**
   * BẤM NÚT START -> HIỆU ỨNG CHUYỂN CẢNH (TRANSITION)
   */
  startBtn.addEventListener('click', (e) => {
    audio.init();
    audio.playChime();

    // 1. Pháo hoa bung tỏa ngay tại nút Start
    const rect = startBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    sky.addExplosion(centerX, centerY, 60);

    // 2. Hiệu ứng phóng to chuyển cảnh
    transitionCurtain.classList.add('active');
    burstCircle.classList.add('expand');
    startScreen.classList.add('hidden');

    // 3. Sau khi chuyển cảnh mở màn hình chúc mừng
    setTimeout(() => {
      transitionCurtain.classList.remove('active');
      mainScreen.classList.add('visible');

      // Thêm pháo hoa chúc mừng
      sky.addExplosion(window.innerWidth * 0.3, window.innerHeight * 0.35, 50);
      sky.addExplosion(window.innerWidth * 0.7, window.innerHeight * 0.35, 50);

      // Bắt đầu phát bài Happy Birthday
      audio.playHappyBirthday();

      // Bắt đầu chạy hiệu ứng chữ chạy lời chúc
      startTypewriter(currentConfig.letterMessage, letterContentEl);
    }, 700);
  });

  /**
   * TƯƠNG TÁC THỔI NẾN TRÊN BÁNH SINH NHẬT
   */
  cakeWrapper.addEventListener('click', () => {
    if (!isFlameBlown) {
      // Thổi nến
      isFlameBlown = true;
      candleFlame.classList.add('blown-out');
      candleSmoke.classList.add('puff');
      candleHint.innerHTML = '<i>Nến tắt dồi. Ước nguyện sẽ thành sự thật 💙</i>';

      // Âm thanh & pháo hoa chúc mừng
      audio.playCelebrationSound();
      const rect = cakeWrapper.getBoundingClientRect();
      sky.addExplosion(rect.left + rect.width / 2, rect.top + 20, 50);

      setTimeout(() => {
        candleSmoke.classList.remove('puff');
      }, 1500);
    } else {
      // Thắp lại nến
      isFlameBlown = false;
      candleFlame.classList.remove('blown-out');
      candleHint.innerHTML = '<i>Bấm doo nến để thổi và ước một điều ước!</i>';
      audio.playTone(880, 'sine', 0.3, 0, 0.1);
    }
  });

  /**
   * TẠO HIỆU ỨNG TRÁI TIM / SAO BAY KHI NHẤP CHUỘT BẤT KỲ
   */
  document.addEventListener('click', (e) => {
    // Tránh click trên modal
    if (e.target.closest('#edit-modal') || e.target.closest('#edit-modal-btn')) return;

    const heart = document.createElement('div');
    heart.className = 'click-heart';
    const symbols = ['💙', '✨', '🌟', '💎', '🎂', '🎉', '💫', '🦋'];
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1400);
  });

  /**
   * ÂM LƯỢNG / BẬT TẮT NHẠC
   */
  musicToggleBtn.addEventListener('click', () => {
    const isMuted = audio.toggleMute();
    musicToggleBtn.innerHTML = isMuted 
      ? '🔇 <span>Bật nhạc</span>' 
      : '🎵 <span>Nhạc nền</span>';
  });

  /**
   * MODAL CHỈNH SỬA LỜI CHÚC (CHO PHÉP TỰ ĐIỀN TRỰC TIẾP TRÊN GIAO DIỆN)
   */
  if (editModalBtn) {
    editModalBtn.addEventListener('click', () => {
      inputName.value = currentConfig.girlfriendName;
      inputDate.value = currentConfig.birthdayDate;
      inputSender.value = currentConfig.senderName;
      inputMessage.value = currentConfig.letterMessage;
      editModal.classList.add('active');
    });
  }

  function closeEditModal() {
    if (editModal) {
      editModal.classList.remove('active');
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeEditModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeEditModal);

  if (saveConfigBtn) {
    saveConfigBtn.addEventListener('click', () => {
      currentConfig.girlfriendName = inputName.value.trim() || BIRTHDAY_CONFIG.girlfriendName;
      currentConfig.birthdayDate = inputDate.value.trim() || BIRTHDAY_CONFIG.birthdayDate;
      currentConfig.senderName = inputSender.value.trim() || BIRTHDAY_CONFIG.senderName;
      currentConfig.letterMessage = inputMessage.value.trim() || BIRTHDAY_CONFIG.letterMessage;

      populateConfigData();
      closeEditModal();

      // Re-type if already on main screen
      if (mainScreen.classList.contains('visible')) {
        startTypewriter(currentConfig.letterMessage, letterContentEl);
        sky.addExplosion(window.innerWidth / 2, window.innerHeight / 2, 40);
      }
    });
  }

  if (resetConfigBtn) {
    resetConfigBtn.addEventListener('click', () => {
      inputName.value = BIRTHDAY_CONFIG.girlfriendName;
      inputDate.value = BIRTHDAY_CONFIG.birthdayDate;
      inputSender.value = BIRTHDAY_CONFIG.senderName;
      inputMessage.value = BIRTHDAY_CONFIG.letterMessage;
    });
  }

  // Nút pháo hoa chúc mừng phụ
  const triggerConfettiBtn = document.getElementById('trigger-confetti-btn');
  if (triggerConfettiBtn) {
    triggerConfettiBtn.addEventListener('click', () => {
      audio.playCelebrationSound();
      sky.addExplosion(window.innerWidth * 0.25, window.innerHeight * 0.4, 45);
      sky.addExplosion(window.innerWidth * 0.5, window.innerHeight * 0.3, 50);
      sky.addExplosion(window.innerWidth * 0.75, window.innerHeight * 0.4, 45);
    });
  }

  const replayTypewriterBtn = document.getElementById('replay-typewriter-btn');
  if (replayTypewriterBtn) {
    replayTypewriterBtn.addEventListener('click', () => {
      startTypewriter(currentConfig.letterMessage, letterContentEl);
    });
  }

});
