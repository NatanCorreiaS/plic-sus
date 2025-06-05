// Seletores de elementos (mantidos como no seu código)
const physicianSelect = document.getElementById("physician");
const physicianMobileSelect = document.getElementById("physician-mobile");
const dateInput = document.getElementById("date");
const dateMobile = document.getElementById("date-mobile");
const hourSelect = document.getElementById("hour");
const hourMobileSelect = document.getElementById("hour-mobile");
const outputResponse = document.getElementById("output-response");
const appointmentsContainer = document.getElementById("appointments-container");
const pastAppointmentsContainer = document.getElementById("past-appointments");

const URL_API = "https://governmental-rand-apparently-hairy.trycloudflare.com";

let physiciansList = []; // Armazenará a lista de médicos com availableDaysNumeric
let currentUserId = null;

// Mapa para converter nomes de dias (em minúsculo) para números UTC (0=Domingo, ..., 6=Sábado)
const dayNameToUTCDay = {
  "domingo": 0, "sunday": 0,
  "segunda": 1, "monday": 1, "segunda-feira": 1,
  "terça": 2, "tuesday": 2,   "terça-feira": 2, "terca": 2, "terca-feira": 2,
  "quarta": 3, "wednesday": 3, "quarta-feira": 3,
  "quinta": 4, "thursday": 4,  "quinta-feira": 4,
  "sexta": 5, "friday": 5,    "sexta-feira": 5,
  "sábado": 6, "saturday": 6,  "sabado": 6
};

// Atualiza estado dos campos conforme viewport
function updateFormControlsState() {
  const isMobileView = window.innerWidth < 768;
  if (physicianSelect) physicianSelect.disabled = isMobileView;
  if (dateInput) dateInput.disabled = isMobileView;
  if (hourSelect) hourSelect.disabled = isMobileView;
  if (physicianMobileSelect) physicianMobileSelect.disabled = !isMobileView;
  if (dateMobile) dateMobile.disabled = !isMobileView;
  if (hourMobileSelect) hourMobileSelect.disabled = !isMobileView;
}

// Busca médicos e popula selects, normalizando availableDays
async function fetchPhysicians() {
  try {
    const response = await fetch(`${URL_API}/api/physicians`);
    if (!response.ok) throw new Error('Erro ao buscar médicos da API');
    
    const physiciansFromAPI = await response.json();
    
    // Normaliza os 'availableDays' para um array numérico 'availableDaysNumeric'
    physiciansList = physiciansFromAPI.map(physician => {
      let numericAvailableDays = [];
      if (physician.availableDays && Array.isArray(physician.availableDays)) {
        numericAvailableDays = physician.availableDays.map(day => {
          if (typeof day === 'string') {
            return dayNameToUTCDay[day.toLowerCase().replace('-feira', '')]; // Normaliza string antes de mapear
          } else if (typeof day === 'number' && day >= 0 && day <= 6) {
            return day; // Se já for número, usa diretamente
          }
          return undefined; 
        }).filter(day => day !== undefined); // Remove dias não mapeados/inválidos
      }
      return { ...physician, availableDaysNumeric: numericAvailableDays };
    });

    const optionHTML = '<option value="">Escolha um médico</option>';
    if (physicianSelect) physicianSelect.innerHTML = optionHTML;
    if (physicianMobileSelect) physicianMobileSelect.innerHTML = optionHTML;

    physiciansList.forEach((physician) => {
      const option = document.createElement("option");
      option.value = physician.id || physician._id; // Usa o ID original da API
      option.textContent = `${physician.name} - ${physician.specialization} (${physician.clinic})`;
      if (physicianSelect) physicianSelect.appendChild(option.cloneNode(true));
      if (physicianMobileSelect) physicianMobileSelect.appendChild(option);
    });

    console.log('Médicos carregados e processados:', physiciansList);
  } catch (error) {
    console.error('Erro ao buscar ou processar médicos:', error);
    if (outputResponse) {
      outputResponse.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  }
}

// Obtém o dia da semana (0-6) de uma data "YYYY-MM-DD" usando UTC
function getDayOfWeekUTC(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCDay();
}

// Verifica se uma data é válida para um médico (USA availableDaysNumeric)
function isDateValidForPhysician(dateString, physicianId) {
  const physician = physiciansList.find(p => String(p.id || p._id) === String(physicianId));
  
  if (!physician) {
    console.warn(`Médico com ID ${physicianId} não encontrado na lista processada.`);
    return false; // Médico não encontrado, data inválida
  }

  // Se availableDaysNumeric não existe ou está vazio, consideramos que o médico não tem dias definidos.
  // Decida a política: se isso significa "nunca disponível" (retorna false) ou "sempre disponível" (retorna true).
  // Para maior segurança, se não há dias especificados, consideramos que não há disponibilidade.
  if (!physician.availableDaysNumeric || physician.availableDaysNumeric.length === 0) {
    console.warn(`Médico ${physician.name} (ID: ${physicianId}) não possui 'availableDaysNumeric' definidos ou a lista está vazia. Assumindo como indisponível.`);
    return false; 
  }

  const dayOfWeek = getDayOfWeekUTC(dateString); // Retorna número (0-6)
  const isValid = physician.availableDaysNumeric.includes(dayOfWeek);
  console.log(`Validação para ${dateString} (dia ${dayOfWeek}) com médico ${physician.name}: ${isValid}. Dias disponíveis (numérico): ${physician.availableDaysNumeric.join(', ')}`);
  return isValid;
}

// Limita datas disponíveis no date picker (min/max) e loga dias do médico
function setDatePickerRestrictions(physicianId) {
  const isMobileView = window.innerWidth < 768;
  const dateField = isMobileView ? dateMobile : dateInput;
  
  if (!dateField) return;
  
  dateField.value = ""; // Limpa valor anterior da data ao trocar de médico
  
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate()); // Começa a partir de hoje
  
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30); // Limita a 30 dias no futuro

  dateField.min = minDate.toISOString().split("T")[0];
  dateField.max = maxDate.toISOString().split("T")[0];

  const physician = physiciansList.find(p => String(p.id || p._id) === String(physicianId));
  if (physician) {
    // Apenas loga, a restrição visual de dias específicos não é nativa do input type="date"
    console.log(`Restrições para ${physician.name}: Dias disponíveis (numérico UTC) -> ${physician.availableDaysNumeric ? physician.availableDaysNumeric.join(', ') : 'Nenhum especificado'}`);
  }
    // Limpa a mensagem de erro específica da data ao trocar de médico
    const dateErrorContainerId = isMobileView ? 'date-mobile-error' : 'date-error';
    const dateErrorContainer = document.getElementById(dateErrorContainerId);
    if (dateErrorContainer) {
        dateErrorContainer.innerHTML = '';
        dateErrorContainer.style.display = 'none';
    }
}

// VALIDAÇÃO IMEDIATA DA DATA: Função para lidar com a mudança no campo de data
function handleDateInputChange(event) {
  const dateField = event.target;
  const selectedDate = dateField.value;
  const isMobileView = window.innerWidth < 768;
  const physicianId = isMobileView ? (physicianMobileSelect?.value || "") : (physicianSelect?.value || "");

  // Local para exibir o erro específico da data (recomenda-se criar estes divs no HTML)
  // Ex: <div id="date-error" class="text-danger mt-1" style="display: none;"></div> abaixo do input de data desktop
  // Ex: <div id="date-mobile-error" class="text-danger mt-1" style="display: none;"></div> abaixo do input de data mobile
  const errorContainerId = isMobileView ? 'date-mobile-error' : 'date-error';
  const errorContainer = document.getElementById(errorContainerId);

  if (errorContainer) { // Limpa erro anterior do campo de data específico
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
  }
  if (outputResponse && outputResponse.textContent.includes("dia selecionado não está disponível")) {
     outputResponse.innerHTML = ""; // Limpa erro geral se for sobre a data
  }


  if (selectedDate && physicianId) {
    if (!isDateValidForPhysician(selectedDate, physicianId)) {
      const errorMessage = 'O dia selecionado não está disponível para este médico.';
      if (errorContainer) {
        errorContainer.textContent = errorMessage;
        errorContainer.style.display = 'block';
      } else if (outputResponse) { // Fallback para o outputResponse geral
        outputResponse.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
      }
      dateField.value = ""; // Limpa a data inválida
    }
  }
}


// Busca ID do usuário logado
async function getUserId() {
  // ... (código mantido, mas certifique-se que getCookieValue está globalmente acessível ou importada)
  if (currentUserId) return currentUserId;
  const email = typeof getCookieValue === 'function' ? getCookieValue("Email") : null;
  if (!email) {
    console.warn('Email não encontrado nos cookies para getUserId.');
    return null;
  }
  try {
    const response = await fetch(`${URL_API}/api/users`);
    if (!response.ok) throw new Error('Erro ao buscar usuários');
    const users = await response.json();
    const user = users.find(u => u.email === email);
    if (user) {
      currentUserId = user.id || user._id;
      console.log('Usuário encontrado:', currentUserId);
      return currentUserId;
    }
    console.warn('Usuário não encontrado para o email:', email);
    return null;
  } catch (error) {
    console.error('Erro ao buscar ID do usuário:', error);
    return null;
  }
}

// Busca consultas do usuário
async function fetchAppointments() {
  // ... (código mantido, mas usa a physiciansList processada para nome do médico)
  const userId = await getUserId();
  if (!userId) {
    if (appointmentsContainer) appointmentsContainer.innerHTML = "<p class='lead text-muted'>Faça login para ver suas consultas.</p>";
    if (pastAppointmentsContainer) pastAppointmentsContainer.innerHTML = "";
    return;
  }
  try {
    const response = await fetch(`${URL_API}/api/appointments`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const appointments = await response.json();
    const now = new Date();
    let futureAppointmentsHTML = "";
    let pastAppointmentsHTML = "";

    appointments.forEach((appt) => {
      // Verifica se é userId ou patientId dependendo da estrutura retornada pela API
      const appointmentUserId = appt.userId || appt.patientId;
      if (String(appointmentUserId) === String(userId)) {
        const apptDate = new Date(appt.date);
        // Busca na physiciansList processada
        const physicianDetails = physiciansList.find(p => String(p.id || p._id) === String(appt.physicianId));
        
        const physicianName = physicianDetails ? physicianDetails.name : (appt.physicianId || "Médico não especificado");
        const clinicName = appt.clinic || (physicianDetails ? physicianDetails.clinic : null) || "Clínica não especificada";

        const info = `
          <div class="border rounded p-3 mb-3 shadow-sm">
            <p class="mb-1"><strong>Médico:</strong> ${physicianName}</p>
            <p class="mb-1"><strong>Data:</strong> ${apptDate.toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' })}</p>
            <p class="mb-0"><strong>Clínica:</strong> ${clinicName}</p>
          </div>
        `;
        if (apptDate >= now) futureAppointmentsHTML += info;
        else pastAppointmentsHTML += info;
      }
    });
    if (appointmentsContainer) appointmentsContainer.innerHTML = futureAppointmentsHTML || "<p class='lead text-muted'>Nenhuma consulta marcada.</p>";
    if (pastAppointmentsContainer) pastAppointmentsContainer.innerHTML = pastAppointmentsHTML || "<p class='lead text-muted'>Nenhuma consulta no histórico.</p>";
  } catch (error) {
    console.error("Erro ao buscar consultas:", error);
    if (appointmentsContainer) appointmentsContainer.innerHTML = "<p class='alert alert-danger'>Erro ao carregar consultas futuras.</p>";
    if (pastAppointmentsContainer) pastAppointmentsContainer.innerHTML = "<p class='alert alert-danger'>Erro ao carregar histórico de consultas.</p>";
  }
}

// Cria consulta seguindo exatamente a documentação da API
async function createAppointment(physicianId, userId, dateTime) {
  try {
    // Os IDs são strings (ObjectIds do MongoDB), não precisam de conversão para integer
    console.log('Enviando dados para API:', {
      physicianId: physicianId,  // String ObjectId
      userId: userId,           // String ObjectId (campo correto conforme documentação)
      date: dateTime
    });

    const response = await fetch(`${URL_API}/api/appointments`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        physicianId: physicianId,  // String ObjectId conforme documentação
        userId: userId,           // String ObjectId - campo correto é userId, não patientId
        date: dateTime            // String no formato ISO conforme documentação
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Erro da API:', result);
      const errorDetail = result.message || 
        (Array.isArray(result.errors) ? result.errors.map(e => e.msg).join(', ') : 'Erro desconhecido da API');
      throw new Error(errorDetail);
    }
    
    console.log('Consulta criada com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro ao criar consulta:', error);
    throw error;
  }
}

// Configurar eventos de mudança de médico
function setupPhysicianChangeEvents() {
  const handler = function () {
    if (this.value) {
      setDatePickerRestrictions(this.value);
    } else { // Se "Escolha um médico" for selecionado, limpa restrições e data
        const isMobile = this.id === "physician-mobile";
        const dateFieldToClear = isMobile ? dateMobile : dateInput;
        if(dateFieldToClear) {
            dateFieldToClear.value = "";
            dateFieldToClear.min = "";
            dateFieldToClear.max = "";
        }
    }
  };
  if (physicianSelect) physicianSelect.addEventListener("change", handler);
  if (physicianMobileSelect) physicianMobileSelect.addEventListener("change", handler);
}

// Adiciona event listeners para os campos de data para validação imediata
function setupDateEventListeners() {
    if (dateInput) {
        dateInput.addEventListener('change', handleDateInputChange);
    }
    if (dateMobile) {
        dateMobile.addEventListener('change', handleDateInputChange);
    }
}

// Inicializa o formulário de agendamento
function initializeAppointmentForm() {
  const appointmentForm = document.getElementById("appointment-form");
  if (!appointmentForm) return;

  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (outputResponse) outputResponse.innerHTML = "";

    const isMobileView = window.innerWidth < 768;
    const physicianId = isMobileView ? (physicianMobileSelect?.value || "") : (physicianSelect?.value || "");
    const dateValue = isMobileView ? (dateMobile?.value || "") : (dateInput?.value || "");
    const hourValue = isMobileView ? (hourMobileSelect?.value || "") : (hourSelect?.value || "");

    // Validação dos campos obrigatórios
    if (!physicianId || !dateValue || !hourValue) {
      if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-danger">Por favor, preencha todos os campos.</div>';
      return;
    }

    // Validação final do dia da semana antes do submit
    if (!isDateValidForPhysician(dateValue, physicianId)) {
      if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-danger">O dia selecionado não está disponível para este médico. Verifique a data.</div>';
      return;
    }

    const userId = await getUserId();  // Mudança: agora é userId
    if (!userId) {
      if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-danger">Usuário não autenticado. Faça login novamente.</div>';
      return;
    }

    // Monta a data no formato ISO exato conforme documentação: "2023-10-01T10:00:00Z"
    const dateTime = `${dateValue}T${hourValue}:00.000Z`;

    console.log('Dados do formulário:', {
      physicianId,     // String ObjectId
      userId,          // String ObjectId (campo correto)
      dateTime,
      originalDate: dateValue,
      originalHour: hourValue
    });

    try {
      if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-info">Agendando consulta...</div>';
      
      const result = await createAppointment(physicianId, userId, dateTime);  // Mudança: userId em vez de patientId
      
      // Verifica se a resposta contém ID (conforme documentação da API)
      if (result && (result.id || result._id)) { 
        if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-success">Consulta agendada com sucesso!</div>';
        
        // Limpa o formulário
        appointmentForm.reset();
        
        // Limpa campos de data manualmente
        if (dateInput) {
          dateInput.value = "";
          dateInput.min = "";
          dateInput.max = "";
        }
        if (dateMobile) {
          dateMobile.value = "";
          dateMobile.min = "";
          dateMobile.max = "";
        }

        // Atualiza a lista de consultas
        await fetchAppointments();
      } else {
        throw new Error(result.message || 'Resposta inválida da API - consulta não foi criada.');
      }
    } catch (error) {
      console.error('Erro ao submeter agendamento:', error);
      if (outputResponse) outputResponse.innerHTML = `<div class="alert alert-danger">Erro ao agendar consulta: ${error.message}</div>`;
    }
  });
}

// Inicializa o formulário de agendamento
function initializeAppointmentForm() {
  const appointmentForm = document.getElementById("appointment-form");
  if (!appointmentForm) return;

  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (outputResponse) outputResponse.innerHTML = "";

    const isMobileView = window.innerWidth < 768;
    const physicianId = isMobileView ? (physicianMobileSelect?.value || "") : (physicianSelect?.value || "");
    const dateValue = isMobileView ? (dateMobile?.value || "") : (dateInput?.value || "");
    const hourValue = isMobileView ? (hourMobileSelect?.value || "") : (hourSelect?.value || "");

    // Validação dos campos obrigatórios
    if (!physicianId || !dateValue || !hourValue) {
      if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-danger">Por favor, preencha todos os campos.</div>';
      return;
    }

    // Validação final do dia da semana antes do submit
    if (!isDateValidForPhysician(dateValue, physicianId)) {
      if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-danger">O dia selecionado não está disponível para este médico. Verifique a data.</div>';
      return;
    }

    const userId = await getUserId();  // Mudança: agora é userId
    if (!userId) {
      if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-danger">Usuário não autenticado. Faça login novamente.</div>';
      return;
    }

    // Monta a data no formato ISO exato conforme documentação: "2023-10-01T10:00:00Z"
    const dateTime = `${dateValue}T${hourValue}:00.000Z`;

    console.log('Dados do formulário:', {
      physicianId,     // String ObjectId
      userId,          // String ObjectId (campo correto)
      dateTime,
      originalDate: dateValue,
      originalHour: hourValue
    });

    try {
      if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-info">Agendando consulta...</div>';
      
      const result = await createAppointment(physicianId, userId, dateTime);  // Mudança: userId em vez de patientId
      
      // Verifica se a resposta contém ID (conforme documentação da API)
      if (result && (result.id || result._id)) { 
        if (outputResponse) outputResponse.innerHTML = '<div class="alert alert-success">Consulta agendada com sucesso!</div>';
        
        // Limpa o formulário
        appointmentForm.reset();
        
        // Limpa campos de data manualmente
        if (dateInput) {
          dateInput.value = "";
          dateInput.min = "";
          dateInput.max = "";
        }
        if (dateMobile) {
          dateMobile.value = "";
          dateMobile.min = "";
          dateMobile.max = "";
        }

        // Atualiza a lista de consultas
        await fetchAppointments();
      } else {
        throw new Error(result.message || 'Resposta inválida da API - consulta não foi criada.');
      }
    } catch (error) {
      console.error('Erro ao submeter agendamento:', error);
      if (outputResponse) outputResponse.innerHTML = `<div class="alert alert-danger">Erro ao agendar consulta: ${error.message}</div>`;
    }
  });
}

// Inicialização principal
async function initializeApp() {
  console.log('Inicializando aplicação de agendamento...');
  updateFormControlsState(); // Define estado inicial dos controles com base no viewport
  try {
    await fetchPhysicians();    // Carrega médicos primeiro
    setupPhysicianChangeEvents(); // Configura eventos para quando o médico muda
    setupDateEventListeners();    // Configura eventos para quando a data muda
    initializeAppointmentForm();  // Configura o formulário de submissão
    await fetchAppointments();  // Carrega consultas existentes
    console.log('Aplicação de agendamento inicializada com sucesso');
  } catch (error) {
    console.error('Erro crítico na inicialização:', error);
    if (outputResponse) outputResponse.innerHTML = `<div class="alert alert-danger">Erro crítico ao inicializar a aplicação: ${error.message}</div>`;
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('resize', updateFormControlsState);