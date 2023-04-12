const intro = document.querySelector(".intro");
const floatingButton = document.getElementById("floatingButton");

function toggleIntro() {
  if (intro.classList.contains("visible")) {
    intro.classList.remove("visible");
  } else {
    intro.classList.add("visible");
  }
}

floatingButton.addEventListener("click", toggleIntro);
