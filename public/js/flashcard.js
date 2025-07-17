// Helper function to format duration from milliseconds to "Xm Ys"
function formatDuration(ms) {
  if (ms === null || isNaN(ms)) return "--";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  let result = "";
  if (minutes > 0) {
    result += `${minutes}m `;
  }
  result += `${remainingSeconds}s`;
  return result.trim();
}

class FlashCardApp {
  constructor() {
    this.vocabulary = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.totalCards = 50;
    this.speechSynthesis = window.speechSynthesis;
    this.currentAudio = null;
    this.currentUtterance = null;
    this.sessionStartTime = null; // New: To track session start time

    this.initializeElements();
    this.loadVocabulary();
    this.bindEvents();
    this.showTipsModalOnceDaily(); // New: Show tips modal
  }

  initializeElements() {
    this.flashcard = document.getElementById("flashcard");
    this.wordFront = document.getElementById("word-front");
    this.wordBack = document.getElementById("word-back");
    this.wordTypeFront = document.getElementById("word-type-front");
    this.wordTypeBack = document.getElementById("word-type-back");
    this.wordExample = document.getElementById("word-example");
    this.pronunciationText = document.getElementById("pronunciation-text");
    this.pronunciationBtn = document.getElementById("pronunciation-btn");
    this.progressText = document.getElementById("progress-text");
    this.progressBar = document.getElementById("progress-bar");
    this.prevBtn = document.getElementById("prev-btn");
    this.nextBtn = document.getElementById("next-btn");
    this.flipBtn = document.getElementById("flip-btn");
    this.currentPosition = document.getElementById("current-position");
    this.completionRate = document.getElementById("completion-rate");
    this.totalCardsElement = document.getElementById("total-cards");

    // Modal elements
    this.tipsModal = document.getElementById("tips-modal");
    this.tipsModalCloseBtn = document.getElementById("tips-modal-close-btn");
  }

  async loadVocabulary() {
    try {
      const response = await fetch("data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Shuffle and take 50 random words
      this.vocabulary = this.shuffleArray(data.words).slice(0, this.totalCards);
      this.totalCardsElement.textContent = this.vocabulary.length;
      this.displayCurrentCard();
      this.updateProgress();
      this.sessionStartTime = Date.now(); // Start timer when vocabulary is loaded
    } catch (error) {
      console.error("Error loading vocabulary:", error);
      this.loadFallbackData();
      this.sessionStartTime = Date.now(); // Start timer even with fallback
    }
  }

  loadFallbackData() {
    this.vocabulary = [
      {
        tu_vung: "Hello",
        phien_am: "/həˈloʊ/",
        loai_tu: "interjection",
        y_nghia: "Xin chào",
        vi_du: "Hello, how are you today?",
      },
      {
        tu_vung: "Beautiful",
        phien_am: "/ˈbjuːtɪfəl/",
        loai_tu: "adjective",
        y_nghia: "Đẹp",
        vi_du: "She has a beautiful smile.",
      },
      {
        tu_vung: "Learning",
        phien_am: "/ˈlɜːrnɪŋ/",
        loai_tu: "noun/verb",
        y_nghia: "Học tập",
        vi_du: "Learning English is fun and rewarding!",
      },
    ];
    this.totalCards = this.vocabulary.length;
    this.totalCardsElement.textContent = this.vocabulary.length;
    this.displayCurrentCard();
    this.updateProgress();
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  displayCurrentCard() {
    if (this.vocabulary.length === 0) return;

    const currentWord = this.vocabulary[this.currentIndex];
    this.wordFront.textContent = currentWord.tu_vung;
    this.wordBack.textContent = currentWord.y_nghia;
    this.wordTypeFront.textContent = `(${currentWord.loai_tu})`;
    this.wordTypeBack.textContent = `(${currentWord.loai_tu})`;
    this.wordExample.textContent = currentWord.vi_du;
    this.pronunciationText.textContent = currentWord.phien_am;

    // Reset flip state
    this.isFlipped = false;
    this.flashcard.classList.remove("flipped");

    // Add slide-in animation
    this.flashcard.classList.add("slide-in");
    setTimeout(() => {
      this.flashcard.classList.remove("slide-in");
    }, 600);

    // Stop any current speech
    this.stopSpeech();
  }

  updateProgress() {
    const progress = ((this.currentIndex + 1) / this.totalCards) * 100;
    const progressRounded = Math.round(progress);

    this.progressText.textContent = `${this.currentIndex + 1} / ${
      this.totalCards
    }`;
    this.progressBar.style.width = `${progress}%`;
    this.currentPosition.textContent = this.currentIndex + 1;
    this.completionRate.textContent = `${progressRounded}%`;

    // Update button states
    this.prevBtn.disabled = this.currentIndex === 0;

    // Check if we're at the last card
    if (this.currentIndex === this.totalCards - 1) {
      this.nextBtn.textContent = "Done ✓";
      this.nextBtn.classList.remove(
        "btn-secondary",
        "bg-gray-200",
        "hover:bg-gray-300",
        "text-gray-700"
      );
      this.nextBtn.classList.add("btn-primary", "text-white");
      this.nextBtn.disabled = false;
    } else {
      this.nextBtn.textContent = "Next →";
      this.nextBtn.classList.remove("btn-primary", "text-white");
      this.nextBtn.classList.add(
        "btn-secondary",
        "bg-gray-200",
        "hover:bg-gray-300",
        "text-gray-700"
      );
      this.nextBtn.disabled = false;
    }
  }

  showCompletionPage(sessionDuration) {
    // Pass duration to done
    window.location.href = `done?duration=${sessionDuration}`;
  }

  saveSessionStats(duration) {
    const today = new Date();
    const dateKey = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const hourKey = today.getHours().toString().padStart(2, "0"); // HH

    const stats = JSON.parse(localStorage.getItem("flashcardStats") || "{}");

    // Initialize if not exists
    if (!stats.dailyStats) stats.dailyStats = {};
    if (!stats.hourlyStats) stats.hourlyStats = {};
    if (!stats.dailyStats[dateKey]) {
      stats.dailyStats[dateKey] = { totalTimeSpentMs: 0, sessionsCount: 0 };
    }
    if (!stats.hourlyStats[dateKey]) {
      stats.hourlyStats[dateKey] = {};
    }
    if (!stats.hourlyStats[dateKey][hourKey]) {
      stats.hourlyStats[dateKey][hourKey] = 0;
    }

    // Update stats
    stats.dailyStats[dateKey].totalTimeSpentMs += duration;
    stats.dailyStats[dateKey].sessionsCount += 1;
    stats.hourlyStats[dateKey][hourKey] += duration;

    localStorage.setItem("flashcardStats", JSON.stringify(stats));
    console.log("Session stats saved:", stats);
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    this.flashcard.classList.toggle("flipped");

    // Vibration feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  nextCard() {
    if (this.currentIndex === this.totalCards - 1) {
      // If we're at the last card and user clicks Done
      const sessionDuration = Date.now() - this.sessionStartTime;
      this.saveSessionStats(sessionDuration);
      this.showCompletionPage(sessionDuration);
    } else if (this.currentIndex < this.totalCards - 1) {
      this.currentIndex++;
      this.displayCurrentCard();
      this.updateProgress();
    }
  }

  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.displayCurrentCard();
      this.updateProgress();
    }
  }

  speakPronunciation() {
    const currentWord = this.vocabulary[this.currentIndex];
    if (!currentWord) return;

    this.stopSpeech();

    // Get the first letter of the word (uppercase)
    const firstLetter = currentWord.tu_vung.charAt(0).toUpperCase();
    const wordLowercase = currentWord.tu_vung.toLowerCase();

    // Handle X, Y, Z words - they go to X-Y-Z folder
    let folderName = firstLetter;
    if (["X", "Y", "Z"].includes(firstLetter)) {
      folderName = "X-Y-Z";
    }

    // Construct the audio file path: sound/T/the.mp3
    const audioPath = `sound/${folderName}/${wordLowercase}.mp3`;

    // Visual feedback
    this.pronunciationBtn.classList.add("speaking");

    // Try to play MP3 file first
    const audio = new Audio(audioPath);

    // Set up audio event listeners
    audio.onloadeddata = () => {
      // MP3 file exists and is loaded, play it
      audio.play().catch(() => {
        // If play fails, fall back to text-to-speech
        this.fallbackToTTS(currentWord);
      });
    };

    audio.onerror = () => {
      // MP3 file doesn't exist, use text-to-speech
      this.fallbackToTTS(currentWord);
    };

    audio.onended = () => {
      // Audio finished playing
      this.pronunciationBtn.classList.remove("speaking");
    };

    audio.onpause = () => {
      // Audio was paused or stopped
      this.pronunciationBtn.classList.remove("speaking");
    };

    // Store current audio for stopping if needed
    this.currentAudio = audio;

    // Try to load the audio file
    audio.load();
  }

  fallbackToTTS(currentWord) {
    // Create new utterance for text-to-speech
    this.currentUtterance = new SpeechSynthesisUtterance(currentWord.tu_vung);
    this.currentUtterance.lang = "en-US";
    this.currentUtterance.rate = 0.8;
    this.currentUtterance.pitch = 1;

    // Event listeners for TTS
    this.currentUtterance.onend = () => {
      this.pronunciationBtn.classList.remove("speaking");
    };

    this.currentUtterance.onerror = () => {
      this.pronunciationBtn.classList.remove("speaking");
    };

    // Speak using text-to-speech
    this.speechSynthesis.speak(this.currentUtterance);
  }

  stopSpeech() {
    // Stop text-to-speech if running
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }

    // Stop MP3 audio if playing
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    // Remove visual feedback
    this.pronunciationBtn.classList.remove("speaking");
  }

  showTipsModalOnceDaily() {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastShownDate = localStorage.getItem("lastTipsShownDate");

    if (lastShownDate !== today) {
      this.tipsModal.classList.add("show");
      localStorage.setItem("lastTipsShownDate", today);
    }
  }

  closeTipsModal() {
    this.tipsModal.classList.remove("show");
  }

  bindEvents() {
    // Card interactions
    this.flipBtn.addEventListener("click", () => this.flipCard());
    this.flashcard.addEventListener("click", () => this.flipCard());

    // Navigation
    this.nextBtn.addEventListener("click", () => this.nextCard());
    this.prevBtn.addEventListener("click", () => this.prevCard());

    // Pronunciation
    this.pronunciationBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.speakPronunciation();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          this.prevCard();
          break;
        case "ArrowRight":
          e.preventDefault();
          this.nextCard();
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          this.flipCard();
          break;
        case "p":
        case "P":
          e.preventDefault();
          this.speakPronunciation();
          break;
      }
    });

    // Touch gestures for mobile
    let startX = 0;
    let startY = 0;

    this.flashcard.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );

    this.flashcard.addEventListener(
      "touchend",
      (e) => {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const diffX = startX - endX;
        const diffY = startY - endY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) {
            this.nextCard();
          } else {
            this.prevCard();
          }
        }

        startX = 0;
        startY = 0;
      },
      { passive: true }
    );

    // Tips Modal close button
    if (this.tipsModalCloseBtn) {
      this.tipsModalCloseBtn.addEventListener("click", () =>
        this.closeTipsModal()
      );
    }
    // Close modal if clicking outside content
    if (this.tipsModal) {
      this.tipsModal.addEventListener("click", (e) => {
        if (e.target === this.tipsModal) {
          this.closeTipsModal();
        }
      });
    }

    // Mobile navigation toggle
    const mobileNavToggle = document.getElementById("mobile-nav-toggle");
    const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
    const mobileNavCloseBtn = document.getElementById("mobile-nav-close-btn");

    if (mobileNavToggle) {
      mobileNavToggle.addEventListener("click", () => {
        mobileNavOverlay.classList.add("open");
      });
    }
    if (mobileNavCloseBtn) {
      mobileNavCloseBtn.addEventListener("click", () => {
        mobileNavOverlay.classList.remove("open");
      });
    }
    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener("click", (e) => {
        if (e.target === mobileNavOverlay) {
          mobileNavOverlay.classList.remove("open");
        }
      });
    }
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  new FlashCardApp();
});
