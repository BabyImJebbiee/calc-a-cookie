function gameLose() {
  const gameScreen = document.getElementById("game-screen");
  const winScreen = document.getElementById("win-screen");
  const ovenScreen = document.getElementById("oven-screen");
  const loseScreen = document.getElementById("lose-screen");

  // ซ่อนหน้าต่าง ๆ ที่ไม่ใช่หน้า Lose
  [gameScreen, winScreen, ovenScreen].forEach(screen => {
    if(screen) {
      screen.style.display = "none";
      screen.classList.remove("active");
    }
  });

  // แสดงหน้า Lose
  if (loseScreen) {
    loseScreen.style.display = "flex";
    loseScreen.classList.add("active");
  }

  // หยุดเพลงหลัก
  const bgm = document.getElementById("bgm");
  if (bgm && !bgm.paused) {
    bgm.pause();
    bgm.currentTime = 0;
  }

  // เล่นเสียงแพ้
  const loseSound = new Audio("asset/bgm/lose.mp3"); 
  loseSound.volume = 0.7;
  loseSound.play();

  // ปุ่มกลับหน้าโฮม
  const homeBtn = document.getElementById("home-btn-lose");
  if (homeBtn) {
    homeBtn.onclick = () => resetGame();
  }
}

window.gameLose = gameLose;
