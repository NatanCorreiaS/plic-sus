const dateInput = document.querySelector("input[type='date']");
const outputResponse = document.getElementById("output-response");
const dateMobile = document.getElementById("date-mobile");
const clinic = document.getElementById("clinic");
const clinicMobile = document.getElementById("clinic-mobile");
const consultType = document.getElementById("consult-type");
const consultTypeMobile = document.getElementById("consult-type-mobile");

// Clinic validation from desktop
clinic.addEventListener("change", function () {
  if (clinic.value === "AmorSaúde") {
    while (consultType.firstChild) {
      consultType.removeChild(consultType.firstChild);
    }
    consultType.appendChild(new Option("Ginecologista", "Ginecologista"));
    consultType.appendChild(new Option("Neurologista", "Neurologista"));
    consultType.appendChild(new Option("Ortopedista", "Ortopedista"));
    consultType.appendChild(new Option("Cardiologista", "Cardiologista"));
    consultType.appendChild(new Option("Odontologista", "Odontologista"));
  } else if (clinic.value === "AssisteMed") {
    while (consultType.firstChild) {
      consultType.removeChild(consultType.firstChild);
    }
    consultType.appendChild(new Option("Dermatologista", "Dermatologista"));
    consultType.appendChild(new Option("Pediatra", "Pediatra"));
    consultType.appendChild(new Option("Oftamologista", "Oftamologista"));
    consultType.appendChild(new Option("Urologista", "Urologista"));
  } else if (clinic.value === "Dr.Consulta") {
    while (consultType.firstChild) {
      consultType.removeChild(consultType.firstChild);
    }
    consultType.appendChild(new Option("Infectologista", "Infectologista"));
    consultType.appendChild(new Option("Oftamologista", "Oftamologista"));
    consultType.appendChild(new Option("Reumatologista", "Reumatologista"));
    consultType.appendChild(
      new Option("Ginecologista Obstreta", "Ginecologista Obstreta")
    );
  } else {
    while (consultType.firstChild) {
      consultType.removeChild(consultType.firstChild);
    }
    consultType.appendChild(new Option("Tipo de Consulta", ""));
  }
});

clinicMobile.addEventListener("change", function () {
  if (clinicMobile.value === "AmorSaúde") {
    while (consultTypeMobile.firstChild) {
      consultTypeMobile.removeChild(consultTypeMobile.firstChild);
    }
    consultTypeMobile.appendChild(new Option("Ginecologista", "Ginecologista"));
    consultTypeMobile.appendChild(new Option("Neurologista", "Neurologista"));
    consultTypeMobile.appendChild(new Option("Ortopedista", "Ortopedista"));
    consultTypeMobile.appendChild(new Option("Cardiologista", "Cardiologista"));
    consultTypeMobile.appendChild(new Option("Odontologista", "Odontologista"));
  } else if (clinicMobile.value === "AssisteMed") {
    while (consultTypeMobile.firstChild) {
      consultTypeMobile.removeChild(consultTypeMobile.firstChild);
    }
    consultTypeMobile.appendChild(
      new Option("Dermatologista", "Dermatologista")
    );
    consultTypeMobile.appendChild(new Option("Pediatra", "Pediatra"));
    consultTypeMobile.appendChild(new Option("Oftamologista", "Oftamologista"));
    consultTypeMobile.appendChild(new Option("Urologista", "Urologista"));
  } else if (clinicMobile.value === "Dr.Consulta") {
    while (consultTypeMobile.firstChild) {
      consultTypeMobile.removeChild(consultTypeMobile.firstChild);
    }
    consultTypeMobile.appendChild(
      new Option("Infectologista", "Infectologista")
    );
    consultTypeMobile.appendChild(new Option("Oftamologista", "Oftamologista"));
    consultTypeMobile.appendChild(
      new Option("Reumatologista", "Reumatologista")
    );
    consultTypeMobile.appendChild(
      new Option("Ginecologista Obstreta", "Ginecologista Obstreta")
    );
  } else {
    while (consultTypeMobile.firstChild) {
      consultTypeMobile.removeChild(consultTypeMobile.firstChild);
    }
    consultTypeMobile.appendChild(new Option("Tipo de Consulta", ""));
  }
});

// Date validation from desktop
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

// Date validation from mobile
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
