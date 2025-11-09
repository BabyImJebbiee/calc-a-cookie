// stir-oven.js
function goToOvenScene() {
  const gameScreen = document.getElementById("game-screen");
  const ovenScreen = document.getElementById("oven-screen");
  const bakeMessage = document.getElementById("bake-message");
  const serveBtn = document.getElementById("serve-btn");

  gameScreen.classList.remove("active");
  gameScreen.style.display = "none";

  ovenScreen.classList.add("active");
  ovenScreen.style.display = "flex";

  bakeMessage.style.opacity = 1;

  const ovenSound = new Audio("asset/bgm/oven-timer.mp3");
  ovenSound.volume = 1;
  ovenSound.play();

  serveBtn.style.display = "none";

  ovenSound.onended = () => {
    bakeMessage.style.opacity = 0;
    serveBtn.style.display = "block";

    serveBtn.onclick = () => {
      ovenScreen.classList.remove("active");
      ovenScreen.style.display = "none";

      gameWin(); 
    };
  };
}


window.goToOvenScene = goToOvenScene;
