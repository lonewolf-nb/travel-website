
  // for enabling tax toggle switch
  let taxSwitch = document.getElementById("flexSwitchCheckDefault");
  taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (info of taxInfo) {
      if (info.style.display != "inline") {
        info.style.display = "inline";
      } else {
        info.style.display = "none";
      }
    }
  });

  //for slider button of nav options
  // filters slide button add-----------------------------------
  let filtersBox = document.querySelector("#filters");
  let buttonSlide = document.querySelectorAll("#slideButton");

  //scrolling
  buttonSlide.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.className == "left_img_button" ? -1 : 1;
      const scrollImg = direction * (filtersBox.clientWidth - 200);
      filtersBox.scrollBy({ left: scrollImg, behavior: "smooth" });
    });
  });

  //left and right arrow buttons
  filtersBox.addEventListener("scroll", () => {
    buttonSlide[0].style.display = filtersBox.scrollLeft <= 0 ? "none" : "flex";
    buttonSlide[1].style.display =
      filtersBox.scrollLeft >=
      filtersBox.scrollWidth - filtersBox.clientWidth - 5
        ? "none"
        : "flex";
    //console.log(filtersBox.scrollWidth);
    //console.log(filtersBox.scrollWidth - filtersBox.clientWidth);
  });





 // Include taxes toggle button (dynamically changing the price)
const toggle = document.getElementById("flexSwitchCheckDefault");
const prices = document.querySelectorAll(".price");
const taxInfos = document.querySelectorAll(".tax-info");
toggle.addEventListener("change", () => {
  prices.forEach((priceElement, index) => {
    const basePrice = parseFloat(priceElement.dataset.basePrice);
    const taxInfo = taxInfos[index];
    if (toggle.checked) {
      const taxedPrice = Math.round(basePrice * 1.18);
      priceElement.innerHTML = `&#8377; ${taxedPrice.toLocaleString("en-IN")}`;
      taxInfo.style.display = "inline";
    } else {
      priceElement.innerHTML = `&#8377; ${basePrice.toLocaleString("en-IN")}`;
      taxInfo.style.display = "none";
    }
  });
});



  /*
    NOTE:buttonSlide- There's no built-in scrollRight property in JavaScript.
  - To get the right scroll distance, you calculate:
  scrollWidth - clientWidth - scrollLeft
  */
