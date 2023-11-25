const dateInput = document.querySelector("input[type='date']");
const outputResponse = document.getElementById("output-response");
const dateMobile = document.getElementById("date-mobile");

dateInput.addEventListener("change", function () {
  const day = new Date(dateInput.value).getDay();
  console.log(dateInput.value);

  if (day === 0 || day === 6) {
    dateInput.value = "";
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert");
    negativeResponse.classList.add("alert-danger");
    negativeResponse.innerHTML =
      "Não é permitido agendar para sábado ou domingo!";
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    outputResponse.appendChild(negativeResponse);
  } else {
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
  }
});

dateMobile.addEventListener("change", function () {
  const day = new Date(dateMobile.value).getDay();
  console.log(dateMobile.value);

  if (day === 0 || day === 6) {
    dateMobile.value = "";
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert");
    negativeResponse.classList.add("alert-danger");
    negativeResponse.innerHTML =
      "Não é permitido agendar para sábado ou domingo!";
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    outputResponse.appendChild(negativeResponse);
  } else {
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
  }
});
