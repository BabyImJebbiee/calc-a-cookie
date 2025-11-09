function gameWin() {
  const winScreen = document.getElementById("win-screen");
  winScreen.style.display = "flex";
  winScreen.classList.add("active");

  // ซ่อนไม้พายและปุ่ม Stir 
  const spatula = document.getElementById("spatula-img");
  const stirBtn = document.getElementById("stir-btn");
  if(spatula){
    spatula.style.display = "none";
    spatula.style.opacity = "0";
  }
  if(stirBtn) stirBtn.style.display = "none";

  // หยุดเพลงหลัก
  const bgm = document.getElementById("bgm");
  if (bgm && !bgm.paused) {
    bgm.pause();
    bgm.currentTime = 0;
  }

  // เล่นเสียงชนะ
  const winSound = new Audio("asset/bgm/yay.mp3");
  winSound.volume = 0.7;
  winSound.play();

  // ปุ่ม Home
  const homeBtn = document.getElementById("home-btn");
  homeBtn.onclick = () => resetGame();
}
