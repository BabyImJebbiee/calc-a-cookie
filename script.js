document.addEventListener('DOMContentLoaded', () => {
  const bgm = document.getElementById("bgm"),
        startBtn = document.getElementById('start-btn'),
        mainMenu = document.getElementById('game-container'),
        gameScreen = document.getElementById('game-screen'),
        loopStart = 5, loopEnd = 75;

  const correctSound = new Audio('asset/sfx/correct.mp3'),
        wrongSound = new Audio('asset/sfx/wrong.mp3'),
        clickSound = new Audio('asset/sfx/click.mp3');

  // ปุ่ม Start
  if(startBtn){
    startBtn.addEventListener('click', () => {
      bgm.currentTime = 0;
      bgm.volume = 0.6;
      bgm.play().catch(err => console.log("Autoplay blocked:", err));

      mainMenu.classList.remove('active');
      mainMenu.style.display = 'none';

      gameScreen.classList.add('active');
      gameScreen.style.display = 'flex';

      hearts = 3;
      currentIngredient = 0;
      phase = "ingredient";
      renderHearts();
      showIngredient();
      popUpAll();

      setTimeout(() => showQuestion(), 100);
    });
  }
        
  // ====== ข้อมูลคำถาม ======
  const questions = [
    { text: "กำหนดให้ f(x)=√(7 - x)​ และ g(x)=|x - 3| จงหาโดเมนของฟังก์ชัน (f ∘ g)(x)", choices: ["[3, ∞)", "(-∞, ∞)", "[-7, 13]"], answer: 2 },
    { text: "ถ้าเซตคำตอบของอสมการ|3 - 2x|-|3x - 7|≥0 คือช่วง [a,b] แล้ว a+b มีค่าเท่ากับเท่าไหร่", choices: ["4", "6", "7"], answer: 1 },
    { text: "sec²(2tan⁻¹√2) มีค่าเท่าใด", choices: ["9", "8", "√3"], answer: 0 },
    { text: "ต้องการสร้างจำนวนที่มี 7 หลัก จากเลขโดด 7 ตัว คือ 1,2,3,3,4,5,6 โดยให้เลข 3 สองตัวอยู่ติดกัน จะสร้างได้ทั้งหมดกี่จำนวน", choices: ["720", "820", "740"], answer: 0 },
    { text: "กำหนดลำดับซึ่งประกอบด้วยจำนวนเต็มบวกทุกจำนวนที่หารด้วย 5 ไม่ลงตัว เรียงจากน้อยไปมาก ถ้าผลบวก n พจน์แรกของลำดับนี้เท่ากับ 9000 แล้ว n มีค่าเท่ากับข้อใดต่อไปนี้", choices: ["100", "120", "110"], answer: 1 },
    { text: "นักเรียนห้องหนึ่งมี 30 คน สอบวิชาคณิตศาสตร์ได้เกรด A 5 คน ได้เกรด B 15 คนและได้เกรด C 10 คน ถ้าสุ่มนักเรียน 3 คนจากห้องนี้แล้วความน่าจะเป็นที่จะได้นักเรียนอย่างน้อย 1 คนที่ได้เกรด A เท่ากับข้อใด", choices: ["44/203", "66/203", "88/203"], answer: 2 },
    { text: "ผลบวกของคำตอบทั้งหมดของสมการ 4ˣ + 2⁴ = 65(2ˣ⁻¹) เท่ากับข้อใดต่อไปนี้", choices: ["4", "-2", "-4"], answer: 0 },
    { text: "กำหนดให้ a เป็นจำนวนเต็มบวก ถ้าห.ร.ม.ของ a และ 2520 เท่ากับ 60 และ ค.ร.น. ของ a และ 420 เท่ากับ 4620 แล้ว a อยู่ในช่วงในข้อใดต่อไปนี้", choices: ["[500,650]", "[650,800]", "[800,950]"], answer: 1 }
  ];

  // ====== ข้อมูลวัตถุดิบ ======
  const ingredients = [
    { img: "Butter.PNG", defeatedImg: "ButterKO.PNG" },
    { img: "Sugar.PNG", defeatedImg: "SugarKO.PNG" },
    { img: "Egg.PNG", defeatedImg: "EggKO.PNG" },
    { img: "Flour.PNG", defeatedImg: "FlourKO.PNG" }
  ];

  let usedQuestions = [], timer, timeLeft;
  let hearts = 3;
  let currentIngredient = 0;
  let phase = "ingredient"; // เฟสเริ่มต้น

  // ====== ฟังก์ชันช่วย ======
  const shuffleArray = arr => {
    const a = arr.slice();
    for(let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  // ====== แสดงหัวใจ ======
  function renderHearts(){
    const container = document.getElementById("lives-container");
    container.innerHTML = "";
    for(let i=0; i<hearts; i++){
      const img = document.createElement("img");
      img.src = "asset/game/Heart.PNG";
      img.classList.add("heart");
      container.appendChild(img);
    }
  }

  function removeHeart() {
  hearts--;
  renderHearts();
  if (hearts <= 0) {
    gameLose(); //เรียกไปฉากแพ้
  }
}

  // ====== Timer ======
  function startTimer(){
    clearInterval(timer);
    timeLeft = 120;
    const timerText = document.getElementById("timer-text");
    timerText.textContent = timeLeft;

    timer = setInterval(()=>{
      timeLeft--;
      timerText.textContent = timeLeft;
      if (timeLeft <= 0) {
      clearInterval(timer);
      gameLose(); // หมดเวลา → ไปฉากแพ้
      }
    }, 1000);
  }

  function handleTimeUp(){
    wrongSound.play();
    removeHeart();
    showPopupMessage("หมดเวลา! 😢");
  }

  // ====== แสดงคำถาม ======
  function showQuestion(){
    clearInterval(timer);
    if(usedQuestions.length === questions.length) usedQuestions = [];

    let randomIndex;
    do { randomIndex = Math.floor(Math.random()*questions.length); } 
    while(usedQuestions.includes(randomIndex));
    usedQuestions.push(randomIndex);

    const q = questions[randomIndex];
    const questionText = document.getElementById("question-text");
    questionText.textContent = q.text;

    const choiceBtns = document.querySelectorAll(".choice-btn");
    const choiceOrder = shuffleArray([0,1,2]);
    choiceBtns.forEach((btn,i)=>{
      const choiceIndex = choiceOrder[i];
      btn.textContent = q.choices[choiceIndex];
      btn.disabled = false; 
      btn.onmousedown = ()=> btn.style.transform="scale(0.9)";
      btn.onmouseup = ()=> btn.style.transform="scale(1)";
      btn.onclick = ()=> { clickSound.play(); checkAnswer(choiceIndex===q.answer); }
    });

    startTimer();
  }

  // ====== ตรวจคำตอบ ======
  function checkAnswer(isCorrect) {
    clearInterval(timer);
    const ingredient = document.getElementById("ingredient-img");
    const choiceBtns = document.querySelectorAll(".choice-btn");

    if (phase === "stir") {
    if (isCorrect) {
        correctSound.play();
        showPopupMessage("CORRECT!", "#3a7242ff");

        // แสดงปุ่ม Stir ให้กดแล้วไปฉากอบทันที
        setTimeout(() => {
            showPopupButton("Stir", () => {
                // เรียกฟังก์ชันเปลี่ยนไปฉากอบ
                goToOvenScene();
            });
        }, 200); // delay สั้น ๆ แค่ให้ popup ปรากฏ
    } else {
        wrongSound.play();
        removeHeart();
        showPopupMessage("WRONG!", "#c45353ff");
    }
    return;
}


    // ====== เฟสวัตถุดิบ ======
    if (isCorrect) {
      correctSound.play();
      ingredient.src = `asset/game/${ingredients[currentIngredient].defeatedImg}`;
      showPopupMessage("CORRECT!", "#3a7242ff");
      choiceBtns.forEach(btn => btn.disabled = true);

      setTimeout(() => {
        const ingredientName = ingredients[currentIngredient].img.split('.')[0];
        showPopupButton(`Add ${ingredientName}`, () => {
          choiceBtns.forEach(btn => btn.disabled = false);
          throwIngredient();
          showQuestion();
        });
      }, 1200);
    } else {
      wrongSound.play();
      removeHeart();
      showPopupMessage("WRONG!", "#c45353ff");
      startTimer();
    }
  }

  // ====== แสดง popup ======
  function showPopupMessage(text, color="#fff"){
    const msg = document.getElementById("result-message");
    msg.textContent = text;
    msg.style.color = color;
    msg.style.opacity = "1";
    setTimeout(() => { msg.style.opacity = "0"; }, 1200);
  }

  function showPopupButton(buttonText, onClick){
    const popup = document.getElementById("popup-btn-container");
    const popupText = document.getElementById("popup-text");
    const popupBtn = document.getElementById("popup-btn");

    popupText.style.display = "none";
    popupBtn.textContent = buttonText;
    popupBtn.style.display = "block";
    popup.style.display = "flex";
    popup.style.opacity = "1";

    popupBtn.onclick = () => {
      if(onClick) onClick();
      popup.style.display = "none";
    };
  }

  // ====== วัตถุดิบ ======
  function showIngredient() {
  const ingredient = document.getElementById("ingredient-img");
  ingredient.style.display = "block"; 
  ingredient.style.transition = "";
  ingredient.style.transform = "translate(-50%,-50%) scale(1)";
  ingredient.style.opacity = "1";
  ingredient.src = `asset/game/${ingredients[currentIngredient].img}`;
}


  function throwIngredient() {
    const ingredient = document.getElementById("ingredient-img");
    const popup = document.getElementById("popup-btn-container");

    ingredient.style.transition = "transform 1s ease";
    ingredient.style.transform = "translate(0,100px) scale(0.5)";

    setTimeout(() => {
      ingredient.style.transition = "";
      ingredient.style.opacity = "0";
      popup.style.display = "none";

      currentIngredient++;
      if (currentIngredient < ingredients.length) {
        showIngredient();
      } else {
        startStirPhase();
      }
    }, 1000);
  }

 // ====== เฟสไม้พาย ======
function startStirPhase() {
  phase = "stir";
  const ingredient = document.getElementById("ingredient-img");
  const spatula = document.getElementById("spatula-img");
  const stirBtn = document.getElementById("stir-btn");

  if (!ingredient || !spatula || !stirBtn) return;

  // ซ่อนวัตถุดิบ และให้ไม้พายเด้งขึ้นมา
  ingredient.style.display = "none";
  spatula.style.display = "block";
  spatula.style.opacity = "0";
  spatula.style.transition = "transform 0.8s ease, opacity 0.8s";
  spatula.style.transform = "translate(-50%, -60%)";

  setTimeout(() => {
    spatula.style.opacity = "1";
    spatula.style.transform = "translate(-50%, -50%)";
  }, 50);

  // แสดงปุ่ม "Stir"
  stirBtn.style.display = "block";
  stirBtn.onclick = () => {
  stirBtn.style.display = "none";

  // เล่นเสียงไม้พาย
  const stirSound = new Audio("asset/sfx/stir.mp3");
  stirSound.play();

  // หลังเสียงเล่น → เรียกไฟล์ stir-oven.js
  setTimeout(() => {
    goToOvenScene(); // ฟังก์ชันจาก stir-oven.js
  }, 500);
};

}


// ====== เกมชนะ/แพ้ ======
function gameOver() {
  alert("แพ้แล้ว! 😢");
}

function gameWin() {
  alert("ชนะแล้ว! 🎉");
}

// ====== Pop-up ทุก element ======
function popUpAll() {
  document.querySelectorAll('.pop-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), i * 150);
  });
}

// ====== เริ่มเกม ======
startBtn.addEventListener('click', () => {
  bgm.currentTime = 0;
  bgm.volume = 0.6;
  bgm.play().catch(err => console.log("Autoplay blocked:", err));

  mainMenu.classList.remove('active');
  gameScreen.classList.add('active');

  hearts = 3;
  currentIngredient = 0;
  renderHearts();
  showIngredient();
  popUpAll();

  setTimeout(() => showQuestion(), 100);
});

// ====== Loop เพลง ======
bgm.addEventListener("timeupdate", () => {
  if (bgm.currentTime >= loopEnd) bgm.currentTime = loopStart + 0.01;
});

// ====== Expose ======
window.showQuestion = showQuestion;
window.checkAnswer = checkAnswer;

});
