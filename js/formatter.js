const dateInput = document.getElementById("date");
const outputResponse = document.getElementById("output-response");
const dateMobile = document.getElementById("date-mobile");
const clinic = document.getElementById("clinic");
const clinicMobile = document.getElementById("clinic-mobile");
const consultType = document.getElementById("consult-type");
const consultTypeMobile = document.getElementById("consult-type-mobile");
const hour = document.getElementById("hour");
const hourMobile = document.getElementById("hour-mobile");
const appointmentBtn = document.getElementById("appointment-btn");

// Fetch variables
const URL_USER = "https://publisher-sit-recycling-expo.trycloudflare.com/api";
let id;

// Appointments
let appointments = [];
let PastAppointments = [];
const appointmentsTag = document.getElementById("appointments-container");
const pastAppointmentsTag = document.getElementById("past-appointments");

const checkingDesktop = () => {
  if (
    clinic.value === "Escolha uma clínica" ||
    dateInput.value === "" ||
    consultType.value === "Tipo de Consulta"
  ) {
    for (let i = 0; i < hour.children.length; i++) {
      hour.children[i].disabled = true;
    }
    // appointmentBtn.disabled = true;
  } else {
    for (let i = 0; i < hour.children.length; i++) {
      hour.children[i].disabled = false;
    }
  }
};

const checkingMobile = () => {
  if (
    clinicMobile.value === "Escolha uma clínica" ||
    dateMobile.value === "" ||
    consultTypeMobile.value === "Tipo de Consulta"
  ) {
    for (let i = 0; i < hourMobile.children.length; i++) {
      hourMobile.children[i].disabled = true;
    }
  } else {
    for (let i = 0; i < hourMobile.children.length; i++) {
      hourMobile.children[i].disabled = false;
    }
  }
};

const checkingHourMobile = async () => {
  checkingMobile();
  if (hourMobile.value !== "Escolha um horário" && dateMobile.value !== "") {
    await fetch(`${URL_USER}/appointment/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let isUnavailable = false; // Adiciona uma variável para rastrear se o horário está indisponível
        data.forEach((appointment) => {
          if (
            appointment.clinic === clinicMobile.value &&
            appointment.consultationType === consultTypeMobile.value &&
            appointment.date ===
              `${dateMobile.value}T${hourMobile.value}:00.000Z`
          ) {
            isUnavailable = true; // Define como verdadeiro se o horário estiver indisponível
            while (outputResponse.firstChild) {
              outputResponse.removeChild(outputResponse.firstChild);
            }
            const negativeResponse = document.createElement("div");
            negativeResponse.classList.add("alert");
            negativeResponse.classList.add("alert-danger");
            negativeResponse.innerHTML = "Horário indisponível!";
            outputResponse.appendChild(negativeResponse);
            hourMobile.value = "";
            console.log("Horário indisponível");
          }
        });

        // Se o horário estiver disponível, remova o alerta
        if (!isUnavailable && outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
      });
  }
};

const checkingHour = async () => {
  checkingDesktop();
  if (hour.value !== "Escolha um horário" && dateInput.value !== "") {
    await fetch(`${URL_USER}/appointment/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let isUnavailable = false; // Adiciona uma variável para rastrear se o horário está indisponível
        data.forEach((appointment) => {
          if (
            appointment.clinic === clinic.value &&
            appointment.consultationType === consultType.value &&
            appointment.date === `${dateInput.value}T${hour.value}:00.000Z`
          ) {
            isUnavailable = true; // Define como verdadeiro se o horário estiver indisponível
            while (outputResponse.firstChild) {
              outputResponse.removeChild(outputResponse.firstChild);
            }
            const negativeResponse = document.createElement("div");
            negativeResponse.classList.add("alert");
            negativeResponse.classList.add("alert-danger");
            negativeResponse.innerHTML = "Horário indisponível!";
            outputResponse.appendChild(negativeResponse);
            hour.value = "";
            console.log("Horário indisponível");
          }
        });

        // Se o horário estiver disponível, remova o alerta
        if (!isUnavailable && outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
      });
  }
};

// Clinic validation from desktop
clinic.addEventListener("change", function () {
  checkingDesktop();
  // checkingHour();
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

// consultType.addEventListener("change", function () {
//   // checkingHour();
// });

clinicMobile.addEventListener("change", function () {
  checkingMobile();
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
    consultTypeMobile.appendChild(
      new Option("Tipo de Consulta", "Tipo de Consulta")
    );
  }
});

consultTypeMobile.addEventListener("change", function () {
  checkingMobile();
});

// Date validation from desktop
dateInput.addEventListener("change", function () {
  checkingDesktop();
  // checkingHour();
  const day = new Date(dateInput.value).getDay();

  if (day === 6 || day === 5) {
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
  checkingMobile();
  const day = new Date(dateMobile.value).getDay();

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

// date format: 2023-12-21T09:00:00.000Z

// Hour validation from desktop
hour.addEventListener("change", async () => {
  checkingDesktop();
  checkingHour();
});

hourMobile.addEventListener("change", async () => {
  checkingMobile();
  checkingHourMobile();
});

checkingDesktop();
checkingMobile();
const getCookieValueB = (cookieName) => {
  // Exemplo do valor do cookie
  const cookieValue = document.cookie;

  // Dividindo o valor do cookie por vírgulas
  const cookieParts = cookieValue.split(",");

  // Iterando sobre as partes do cookie
  for (let i = 0; i < cookieParts.length; i++) {
    // Verificando se a parte atual começa com "Session"
    if (cookieParts[i].startsWith(cookieName)) {
      // Obtendo o valor após o ":" (ignorando "Session:")
      let sessionValue = cookieParts[i].split(":")[1];

      // Removendo "undefined" (caso haja)
      sessionValue = sessionValue.replace(/undefined/g, "").trim();

      //   console.log("Valor da Session:", sessionValue);
      return sessionValue;
    }
  }
};

let userId;
// fetching user id
const getIdAndFetchAppointments = async () => {
  const email = getCookieValueB("Email");
  await fetch(`${URL_USER}/user/getid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      userId = data.id;
      // console.log(userId);
    })
    .then(() => {
      fetchUserAppointments();
    });
};

const sendAppointmentMobile = () => {
  console.log(`${dateMobile.value}T${hourMobile.value}:00.000Z`);
  fetch(`${URL_USER}/appointment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clinic: clinicMobile.value,
      consultationType: consultTypeMobile.value,
      date: `${dateMobile.value}T${hourMobile.value}:00.000Z`,
      userId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.message === "Erro interno do servidor.") {
        // console.log(erro);
        while (outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
        const negativeResponse = document.createElement("div");
        negativeResponse.classList.add("alert");
        negativeResponse.classList.add("alert-danger");
        negativeResponse.innerHTML =
          "Erro interno do servidor, verifique se a data e horário estão disponíveis!";
        outputResponse.appendChild(negativeResponse);
      } else {
        while (outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
        const positiveResponse = document.createElement("div");
        positiveResponse.classList.add("alert");
        positiveResponse.classList.add("alert-success");
        positiveResponse.innerHTML = "Consulta agendada com sucesso!";
        outputResponse.appendChild(positiveResponse);
      }
    });
};

// 2023-11-26T08:00:00.000Z
const sendAppointment = () => {
  console.log(`${dateInput.value}T${hour.value}:00.000Z`);
  fetch(`${URL_USER}/appointment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clinic: clinic.value,
      consultationType: consultType.value,
      date: `${dateInput.value}T${hour.value}:00.000Z`,
      userId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.message === "Erro interno do servidor.") {
        // console.log(erro);
        while (outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
        const negativeResponse = document.createElement("div");
        negativeResponse.classList.add("alert");
        negativeResponse.classList.add("alert-danger");
        negativeResponse.innerHTML =
          "Erro interno do servidor, verifique se a data e horário estão disponíveis!";
        outputResponse.appendChild(negativeResponse);
      } else {
        while (outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
        const positiveResponse = document.createElement("div");
        positiveResponse.classList.add("alert");
        positiveResponse.classList.add("alert-success");
        positiveResponse.innerHTML = "Consulta agendada com sucesso!";
        outputResponse.appendChild(positiveResponse);
      }
    });
};

getIdAndFetchAppointments();
// console.log(userId);

// Utility functions for date
function padZero(numero) {
  return numero < 10 ? "0" + numero : numero;
}

function padZeros(numero, quantidade) {
  let string = numero.toString();
  while (string.length < quantidade) {
    string = "0" + string;
  }
  return string;
}

// Fetching appointments function
const fetchUserAppointments = () => {
  fetch(`${URL_USER}/appointment/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Obtendo a data atual
      const actualDate = new Date();

      // Formatando a data atual no formato "YYYY-MM-DDTHH:mm:ss.sssZ"
      const year = actualDate.getUTCFullYear();
      const month = padZero(actualDate.getUTCMonth() + 1); // Meses são base 0, então é necessário adicionar 1
      const day = padZero(actualDate.getUTCDate());
      const hour = padZero(actualDate.getUTCHours() - 3);
      const minutes = padZero(actualDate.getUTCMinutes());
      const seconds = padZero(actualDate.getUTCSeconds());
      const miliseconds = padZeros(actualDate.getUTCMilliseconds(), 3);

      const formatedDate = `${year}-${month}-${day}T${hour}:${minutes}:${seconds}.${miliseconds}Z`;
      const date = new Date(formatedDate);
      data.forEach((appointment) => {
        if (new Date(appointment.date) < date) {
          PastAppointments.push(appointment);
        } else {
          appointments.push(appointment);
        }
      });
    })
    .then(() => {
      createAppointments();
      createPastApppointments();
    });
};

// Creating appointments cards
const createAppointments = () => {
  if (appointments.length > 0) {
    appointments.forEach((appointment) => {
      const appointmentCard = document.createElement("div");
      appointmentCard.classList.add("alert");
      appointmentCard.classList.add("alert-primary");
      const date = new Date(appointment.date).getDate();
      const month = new Date(appointment.date).getMonth() + 1;
      const year = new Date(appointment.date).getFullYear();
      const hour = new Date(appointment.date).getUTCHours();
      let minutes = new Date(appointment.date).getUTCMinutes();
      if (minutes === 0) {
        minutes = "00";
      }
      // console.log(hour, minutes);
      appointmentCard.innerText = `Clínica: ${appointment.clinic} | Tipo de Consulta: ${appointment.consultationType} | Data: ${date}/${month}/${year} | Horário: ${hour}:${minutes}h`;
      appointmentsTag.appendChild(appointmentCard);
    });
  } else {
    const appointmentCard = document.createElement("div");
    appointmentCard.classList.add("alert");
    appointmentCard.classList.add("alert-primary");
    appointmentCard.innerText = "Você não possui consultas agendadas!";
    appointmentsTag.appendChild(appointmentCard);
  }
};

// Creating past appointments cards
const createPastApppointments = () => {
  if (PastAppointments.length > 0) {
    PastAppointments.forEach((appointment) => {
      const appointmentCard = document.createElement("div");
      appointmentCard.classList.add("alert");
      appointmentCard.classList.add("alert-danger");
      const date = new Date(appointment.date).getDate();
      const month = new Date(appointment.date).getMonth() + 1;
      const year = new Date(appointment.date).getFullYear();
      const hour = new Date(appointment.date).getUTCHours();
      let minutes = new Date(appointment.date).getUTCMinutes();
      if (minutes === 0) {
        minutes = "00";
      }
      appointmentCard.innerText = `Clínica: ${appointment.clinic} | Tipo de Consulta: ${appointment.consultationType} | Data: ${date}/${month}/${year} | Horário: ${hour}:${minutes}h`;
      pastAppointmentsTag.appendChild(appointmentCard);
    });
  } else {
    const appointmentCard = document.createElement("div");
    appointmentCard.classList.add("alert");
    appointmentCard.classList.add("alert-danger");
    appointmentCard.innerText = "Você não possui consultas passadas!";
    pastAppointmentsTag.appendChild(appointmentCard);
  }
};

// console.log(appointments);
// console.log(PastAppointments);

appointmentBtn.addEventListener("click", async () => {
  // window.location.href = "#";
  event.preventDefault();
  if (
    clinic.value !== "Escolha uma clínica" &&
    dateInput.value !== "" &&
    consultType.value !== "Tipo de Consulta" &&
    hour.value !== "Escolha um horário"
  ) {
    await sendAppointment();
  } else if (
    clinicMobile.value !== "Escolha uma clínica" &&
    dateMobile.value !== "" &&
    consultTypeMobile.value !== "Tipo de Consulta" &&
    hourMobile.value !== "Escolha um horário"
  ) {
    await sendAppointmentMobile();
  } else {
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert");
    negativeResponse.classList.add("alert-danger");
    negativeResponse.innerHTML = "Preencha todos os campos!";
    outputResponse.appendChild(negativeResponse);
  }
});
