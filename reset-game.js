function resetGame() {
  const screens = ['game-screen', 'oven-screen', 'win-screen', 'lose-screen'];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if(el){
      el.classList.remove('active');
      el.style.display = 'none';
    }
  });

  const mainMenu = document.getElementById('game-container');
  if(mainMenu){
    mainMenu.classList.add('active');
    mainMenu.style.display = 'flex';
  }

  // รีเซ็ตตัวแปรเกม
  hearts = 3;
  currentIngredient = 0;
  phase = "ingredient";
  usedQuestions = [];
  renderHearts();
  showIngredient();

  // หยุด BGM
  const bgm = document.getElementById("bgm");
  if(bgm){
    bgm.pause();
    bgm.currentTime = 0;
  }
}

// ปุ่ม Home ทั้ง Win และ Lose
document.addEventListener('DOMContentLoaded', () => {
  const homeBtnWin = document.getElementById("home-btn");
  const homeBtnLose = document.getElementById("home-btn-lose");
  if(homeBtnWin) homeBtnWin.onclick = () => resetGame();
  if(homeBtnLose) homeBtnLose.onclick = () => resetGame();
});

