"use strict";

const radioGroups = document.querySelectorAll(".form__radio-group-wrap");

radioGroups.forEach((group) => {
  const radio = group.querySelector(".form__radio");

  radio.addEventListener("change", () => {
    radioGroups.forEach((g) => (g.style.backgroundColor = ""));
    if (radio.checked) {
      group.style.backgroundColor = "var(--radio-bg)";
    }
  });
});
