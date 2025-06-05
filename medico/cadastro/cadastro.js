document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const specialty = document.getElementById('specialty').value;
    const clinic = document.getElementById('clinic').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    const availableDaysCheckboxes = {
        segunda: document.getElementById('segunda').checked,
        terca: document.getElementById('terca').checked,
        quarta: document.getElementById('quarta').checked,
        quinta: document.getElementById('quinta').checked,
        sexta: document.getElementById('sexta').checked
    };

    // Elemento para exibir mensagens
    const outputResponse = document.getElementById('output-response');
    if (outputResponse) outputResponse.innerHTML = '';

    if (password !== confirmPassword) {
        if (outputResponse) {
            outputResponse.innerHTML = `<div class="alert alert-danger">As senhas não coincidem! Por favor, verifique.</div>`;
        }
        return;
    }

    const availableDaysArray = Object.keys(availableDaysCheckboxes).filter(day => availableDaysCheckboxes[day]);

    const formData = {
        name: name,
        specialization: specialty,
        clinic: clinic,
        email: email,
        password: password,
        availableDays: availableDaysArray
    };

    fetch('https://governmental-rand-apparently-hairy.trycloudflare.com/api/physicians/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message || 'Erro ao processar a requisição'); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Sucesso:', data);
        if (outputResponse) {
            outputResponse.innerHTML = `<div class="alert alert-success">Cadastro realizado com sucesso!</div>`;
        }
        // Redirecionar após um tempo
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 1500);
    })
    .catch((error) => {
        console.error('Erro no cadastro:', error);
        if (outputResponse) {
            outputResponse.innerHTML = `<div class="alert alert-danger">Ocorreu um erro ao cadastrar: ${error.message || 'Tente novamente.'}</div>`;
        }
    });
});