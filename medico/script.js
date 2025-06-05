const appointmentsUrl = 'https://governmental-rand-apparently-hairy.trycloudflare.com/api/appointments';
const usersUrl = 'https://governmental-rand-apparently-hairy.trycloudflare.com/api/users';

let users = [];

function carregarPacientes() {
  const medicoId = localStorage.getItem('physicianId');
  if (!medicoId) {
    document.getElementById('consultasContainer').innerHTML = '<p>Nenhum médico logado.</p>';

    const nav = document.getElementById('medicoLogado');
    if (nav) nav.textContent = '';
    return;
  }

  fetch(usersUrl)
    .then(res => res.json())
    .then(data => {
      users = data;
      listarConsultas(medicoId);
    })
    .catch(err => console.error('Erro ao carregar pacientes:', err));
}

function listarConsultas(medicoId) {
  fetch(appointmentsUrl)
    .then(res => res.json())
    .then(consultas => {
      const container = document.getElementById('consultasContainer');
      container.innerHTML = '';

      // Corrigido: compara ambos como string e remove espaços
      const consultasDoMedico = consultas.filter(c => 
        String(c.physicianId).trim() === String(medicoId).trim()
      );

      if (consultasDoMedico.length === 0) {
        container.innerHTML = '<p>Nenhuma consulta agendada para este médico.</p>';
        return;
      }

      const nomeMedico = localStorage.getItem('physicianName') || 'Médico não identificado';
      const nav = document.getElementById('medicoLogado');
      if (nav) {
        nav.textContent = `Olá, Dr(a). ${nomeMedico}`;
      }

      consultasDoMedico.forEach(c => {
        const dataHora = new Date(c.date);
        const data = dataHora.toLocaleDateString('pt-BR');
        const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const paciente = users.find(u => String(u._id).trim() === String(c.userId).trim());
        const pacienteNome = paciente ? paciente.username : 'Paciente não encontrado';

        // Card Bootstrap
        const cardCol = document.createElement('div');
        cardCol.className = 'col-md-6 col-lg-4';

        const card = document.createElement('div');
        card.className = 'card shadow-sm h-100';

        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title mb-2"><i class="fa-solid fa-user me-2"></i>${pacienteNome}</h5>
            <p class="card-text mb-1"><strong>Data:</strong> ${data}, ${hora}</p>
            <p class="card-text mb-1"><strong>Clínica:</strong> ${c.clinic}</p>
          </div>
        `;
        cardCol.appendChild(card);
        container.appendChild(cardCol);
      });
    })
    .catch(err => {
      console.error('Erro ao listar consultas:', err);
      document.getElementById('consultasContainer').innerHTML = '<p>Erro ao carregar consultas.</p>';
    });
}

window.onload = carregarPacientes;

console.log("Script de consultas carregado com sucesso!");