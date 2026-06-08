const celebrateButton = document.getElementById("celebrateButton");
const confettiLayer = document.getElementById("confettiLayer");
const stickerScatter = document.getElementById("stickerScatter");
const slideNodes = Array.from(document.querySelectorAll(".birthday-slide"));
const prevSlideButton = document.getElementById("prevSlideButton");
const nextSlideButton = document.getElementById("nextSlideButton");
const slideDots = Array.from(document.querySelectorAll(".slide-dot"));
const birthdayCard = document.querySelector(".birthday-card");
const letterScene = document.getElementById("letterScene");
const openLetterButton = document.getElementById("openLetterButton");
const closeLetterButton = document.getElementById("closeLetterButton");
let revealTimer = null;
let currentSlideIndex = 0;

const confettiPalette = ["#ff7fa8", "#ffb3c8", "#ffd166", "#ffffff", "#ff9f1c"];
const stickerAssets = [
  "./Image/素材1.jpg",
  "./Image/素材2.jpg",
  "./Image/素材3.jpg",
  "./Image/素材4.jpg",
  "./Image/素材5.jpg",
  "./Image/素材6.jpg",
  "./Image/素材7.jpg",
];

const stickerZones = [
  { x: [1, 11], y: [4, 16] },
  { x: [80, 95], y: [4, 16] },
  { x: [2, 12], y: [18, 32] },
  { x: [83, 96], y: [18, 32] },
  { x: [2, 12], y: [34, 48] },
  { x: [84, 96], y: [34, 48] },
  { x: [2, 12], y: [50, 64] },
  { x: [83, 95], y: [50, 64] },
  { x: [2, 12], y: [66, 80] },
  { x: [82, 95], y: [66, 80] },
  { x: [10, 22], y: [1, 11] },
  { x: [76, 89], y: [1, 11] },
  { x: [22, 34], y: [1, 11] },
  { x: [60, 72], y: [1, 11] },
  { x: [18, 30], y: [87, 97] },
  { x: [68, 82], y: [87, 97] },
  { x: [36, 48], y: [88, 98] },
  { x: [50, 62], y: [88, 98] },
];

function createConfettiPiece() {
  const piece = document.createElement("span");
  const size = 8 + Math.random() * 12;
  const left = Math.random() * 100;
  const duration = 2.6 + Math.random() * 2.2;
  const drift = `${-120 + Math.random() * 240}px`;
  const color = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];

  piece.className = "confetti-piece";
  piece.textContent = Math.random() > 0.5 ? "❤" : "✦";
  piece.style.left = `${left}vw`;
  piece.style.top = `-8vh`;
  piece.style.fontSize = `${size}px`;
  piece.style.lineHeight = "1";
  piece.style.color = color;
  piece.style.setProperty("--duration", `${duration}s`);
  piece.style.setProperty("--drift", drift);
  piece.style.animationDelay = `${Math.random() * 0.25}s`;

  return piece;
}

function burstConfetti(count = 32) {
  for (let index = 0; index < count; index += 1) {
    const piece = createConfettiPiece();
    confettiLayer.appendChild(piece);

    window.setTimeout(() => {
      piece.remove();
    }, 5200);
  }
}

function shuffle(items) {
  const cloned = [...items];
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }
  return cloned;
}

function renderStickers() {
  if (!stickerScatter) {
    return;
  }

  stickerScatter.innerHTML = "";

  const stickerCount = window.matchMedia("(max-width: 640px)").matches ? 5 : window.matchMedia("(max-width: 960px)").matches ? 10 : 24;
  const shuffledAssets = shuffle([
    ...stickerAssets,
    ...stickerAssets,
    ...stickerAssets,
    ...stickerAssets,
  ]).slice(0, stickerCount);
  const shuffledZones = shuffle(stickerZones);

  shuffledAssets.forEach((source, index) => {
    const sticker = document.createElement("div");
    const image = document.createElement("img");
    const zone = shuffledZones[index % shuffledZones.length];
    const size = window.matchMedia("(max-width: 640px)").matches ? 38 + Math.random() * 14 : 48 + Math.random() * 34;
    const rotate = -22 + Math.random() * 44;
    const drift = -8 + Math.random() * 16;

    sticker.className = "scatter-sticker";
    if (Math.random() > (window.matchMedia("(max-width: 640px)").matches ? 0.15 : 0.32)) {
      sticker.classList.add("is-float");
    }
    sticker.style.left = `${zone.x[0] + Math.random() * (zone.x[1] - zone.x[0])}%`;
    sticker.style.top = `${zone.y[0] + Math.random() * (zone.y[1] - zone.y[0])}%`;
    sticker.style.width = `${size}px`;
    sticker.style.setProperty("--rotate", `${rotate}deg`);
    sticker.style.transform = `rotate(${rotate}deg) translateY(${drift}px)`;
    sticker.style.zIndex = String(3 + (index % 3));
    sticker.style.opacity = window.matchMedia("(max-width: 640px)").matches ? (0.48 + Math.random() * 0.18).toFixed(2) : "0.95";

    image.src = source;
    image.alt = "";
    image.loading = "lazy";

    sticker.appendChild(image);
    stickerScatter.appendChild(sticker);
  });
}

function celebrate() {
  birthdayCard.classList.add("is-celebrating");
  burstConfetti();

  window.setTimeout(() => {
    birthdayCard.classList.remove("is-celebrating");
  }, 700);
}

function openLetter() {
  if (letterScene.classList.contains("is-open")) {
    return;
  }

  const isOpen = letterScene.classList.toggle("is-open");
  letterScene.classList.remove("is-revealed");
  openLetterButton.disabled = isOpen;
  openLetterButton.setAttribute("aria-expanded", String(isOpen));
  openLetterButton.querySelector(".envelope-label strong").textContent = isOpen ? "贺卡已打开" : "生日信封";
  openLetterButton.querySelector(".envelope-label span").textContent = isOpen ? "愿你收下今天的快乐" : "点击打开";
  burstConfetti(isOpen ? 44 : 18);

  if (revealTimer) {
    window.clearTimeout(revealTimer);
  }

  revealTimer = window.setTimeout(() => {
    letterScene.classList.add("is-revealed");
  }, 240);
}

function closeLetter(shouldBurst = true) {
  if (!letterScene.classList.contains("is-open")) {
    return;
  }

  if (revealTimer) {
    window.clearTimeout(revealTimer);
    revealTimer = null;
  }

  letterScene.classList.remove("is-open");
  letterScene.classList.remove("is-revealed");
  openLetterButton.disabled = false;
  openLetterButton.setAttribute("aria-expanded", "false");
  openLetterButton.querySelector(".envelope-label strong").textContent = "生日信封";
  openLetterButton.querySelector(".envelope-label span").textContent = "点击打开";
  if (shouldBurst) {
    burstConfetti(12);
  }
}

function updateSlideState(nextIndex) {
  const clampedIndex = Math.max(0, Math.min(nextIndex, slideNodes.length - 1));
  currentSlideIndex = clampedIndex;

  slideNodes.forEach((slide, index) => {
    slide.classList.remove("is-active", "is-prev", "is-next");
    if (index === clampedIndex) {
      slide.classList.add("is-active");
    } else if (index < clampedIndex) {
      slide.classList.add("is-prev");
    } else {
      slide.classList.add("is-next");
    }
  });

  slideDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === clampedIndex);
  });

  prevSlideButton.disabled = clampedIndex === 0;
  nextSlideButton.disabled = clampedIndex === slideNodes.length - 1;

  if (clampedIndex !== 1) {
    closeLetter(false);
  }
}

function goToSlide(nextIndex) {
  updateSlideState(nextIndex);
}

celebrateButton.addEventListener("click", celebrate);
openLetterButton.addEventListener("click", openLetter);
closeLetterButton.addEventListener("click", closeLetter);
prevSlideButton.addEventListener("click", () => {
  goToSlide(currentSlideIndex - 1);
});
nextSlideButton.addEventListener("click", () => {
  goToSlide(currentSlideIndex + 1);
});
slideDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    goToSlide(Number(dot.dataset.dot));
  });
});
letterScene.addEventListener("click", (event) => {
  if (event.target === letterScene) {
    closeLetter();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    goToSlide(currentSlideIndex - 1);
    return;
  }

  if (event.key === "ArrowRight") {
    goToSlide(currentSlideIndex + 1);
    return;
  }

  if (event.key === "Escape") {
    closeLetter();
  }
});

window.addEventListener("load", () => {
  renderStickers();
  updateSlideState(0);

  birthdayCard.animate(
    [
      { opacity: 0, transform: "translateY(18px) scale(0.985)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ],
    {
      duration: 780,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      fill: "both",
    }
  );

  const floatables = document.querySelectorAll(".floating-note, .message-card, .footer-banner");
  floatables.forEach((element, index) => {
    element.animate(
      [
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 650,
        delay: 180 + index * 110,
        easing: "ease-out",
        fill: "both",
      }
    );
  });

  const pagePieces = document.querySelectorAll(".wish-pill, .section-heading, .letter-scene, .message-card, .footer-banner, .scatter-sticker");
  pagePieces.forEach((element, index) => {
    element.animate(
      [
        { opacity: 0, transform: "translateY(14px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 700,
        delay: 380 + index * 120,
        easing: "ease-out",
        fill: "both",
      }
    );
  });
});

window.addEventListener("resize", () => {
  renderStickers();
});
