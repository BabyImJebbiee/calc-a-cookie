function gameWin() {
  const winScreen = document.getElementById("win-screen");
  winScreen.style.display = "flex";
  winScreen.classList.add("active");

  // หยุดเพลงหลัก
  const bgm = document.getElementById("bgm");
  if (bgm && !bgm.paused) {
    bgm.pause();
    bgm.currentTime = 0;
  }

  // เล่นเสียง
  const winSound = new Audio("asset/bgm/yay.mp3");
  winSound.volume = 0.7;
  winSound.play();

  // หน้า Win
const homeBtn = document.getElementById("home-btn");
homeBtn.onclick = () => {
  // เรียกฟังก์ชันรีเซ็ตเกม
  resetGame();
};

}

window.gameWin = gameWin;
