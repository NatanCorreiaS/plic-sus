const URL_USER = "https://publisher-sit-recycling-expo.trycloudflare.com/api";
const URL_API = "https://publisher-sit-recycling-expo.trycloudflare.com";
const physicianSelect = document.getElementById("physician");
const physicianMobileSelect = document.getElementById("physician-mobile");
const dateInput = document.getElementById("date");
const dateMobile = document.getElementById("date-mobile");
const hour = document.getElementById("hour");
const hourMobile = document.getElementById("hour-mobile");
const outputResponse = document.getElementById("output-response");

// Buscar médicos
async function fetchPhysicians() {
  try {
    const response = await fetch(`${URL_API}/api/physicians`);
    const physicians = await response.json();

    physicianSelect.innerHTML = '<option selected>Escolha um médico</option>';
    physicianMobileSelect.innerHTML = '<option selected>Escolha um médico</option>';

    physicians.forEach((physician) => {
      const option = document.createElement("option");
      option.value = physician._id || physician.id;
      option.textContent = `${physician.name} - ${physician.specialization} (${physician.clinic})`;
      physicianSelect.appendChild(option);

      const optionMobile = option.cloneNode(true);
      physicianMobileSelect.appendChild(optionMobile);
    });
  } catch (err) {
    outputResponse.innerHTML = '<div class="alert alert-danger">Erro ao buscar médicos.</div>';
  }
}

// Obter ID do usuário logado
async function getUserId() {
  const email = getCookieValueB("Email");
  const response = await fetch(`${URL_API}/api/users/getid`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return data.id;
}

// Criar consulta
async function createAppointment(physicianId, patientId, date, hour) {
  const dateTime = `${date}T${hour}:00.000Z`;
  const response = await fetch(`${URL_API}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      physicianId,
      patientId,
      date: dateTime,
    }),
  });
  return response.json();
}

// Evento submit
document.getElementById("appointment-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const isMobile = window.innerWidth < 768;
  const physicianId = isMobile
    ? physicianMobileSelect.value
    : physicianSelect.value;
  const date = isMobile ? dateMobile.value : dateInput.value;
  const hourValue = isMobile ? hourMobile.value : hour.value;

  if (
    !physicianId ||
    physicianId === "Escolha um médico" ||
    !date ||
    !hourValue ||
    hourValue === "Escolha um Horário"
  ) {
    outputResponse.innerHTML =
      '<div class="alert alert-danger">Preencha todos os campos!</div>';
    return;
  }

  const patientId = await getUserId();
  const result = await createAppointment(physicianId, patientId, date, hourValue);

  if (result.id) {
    outputResponse.innerHTML =
      '<div class="alert alert-success">Consulta agendada com sucesso!</div>';
  } else {
    outputResponse.innerHTML =
      `<div class="alert alert-danger">${result.message || "Erro ao agendar consulta."}</div>`;
  }
});

// Utilitário para cookie
function getCookieValueB(cookieName) {
  const cookieValue = document.cookie;
  const cookieParts = cookieValue.split(",");
  for (let i = 0; i < cookieParts.length; i++) {
    if (cookieParts[i].startsWith(cookieName)) {
      let sessionValue = cookieParts[i].split(":")[1];
      sessionValue = sessionValue.replace(/undefined/g, "").trim();
      return sessionValue;
    }
  }
}

// Chamar ao carregar a página
fetchPhysicians();
