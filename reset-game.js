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
  phase = "ingredient"; // ✅ เฟสกลับเป็น ingredient
  usedQuestions = [];
  renderHearts();

  // รีเซ็ต element ของเกม
  const ingredient = document.getElementById("ingredient-img");
  const spatula = document.getElementById("spatula-img");
  const stirBtn = document.getElementById("stir-btn");
  const popup = document.getElementById("popup-btn-container");

  if(ingredient){
    ingredient.style.display = "block";   // ✅ แสดงวัตถุดิบ
    ingredient.style.opacity = "1";
    showIngredient();
  }
  if(spatula){
    spatula.style.display = "none";       // ✅ ซ่อนไม้พาย
    spatula.style.opacity = "0";
    spatula.style.transform = "translate(-50%, -60%)"; // รีเซ็ตตำแหน่ง
  }
  if(stirBtn) stirBtn.style.display = "none"; // ✅ ซ่อนปุ่ม Stir
  if(popup) popup.style.display = "none";

  // รีเซ็ตปุ่มคำตอบ
  document.querySelectorAll(".choice-btn").forEach(btn => btn.disabled = false);

  // หยุด BGM
  const bgm = document.getElementById("bgm");
  if(bgm){
    bgm.pause();
    bgm.currentTime = 0;
  }

  // รีเซ็ต timer
  clearInterval(timer);
}

