document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const outputResponse = document.getElementById('output-response');
        if (outputResponse) outputResponse.innerHTML = '';

        const formData = {
            email: email,
            password: password
        };

        fetch('https://governmental-rand-apparently-hairy.trycloudflare.com/api/physicians/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Erro de autenticação.');
                });
            }
        })
        .then(data => {
            console.log('Login bem-sucedido:', data);

            // Se a resposta contém o email, mas não o id, buscar o id pelo email
            if (data.email === email && (!data._id && !data.id && !data.physicianId)) {
                fetch('https://governmental-rand-apparently-hairy.trycloudflare.com/api/physicians')
                    .then(res => res.json())
                    .then(physicians => {
                        const medico = physicians.find(p => p.email === email);
                        if (medico && medico._id) {
                            localStorage.setItem('physicianId', medico._id);
                            localStorage.setItem('physicianName', medico.name || medico.username || '');
                            if (outputResponse) {
                                outputResponse.innerHTML = `<div class="alert alert-success">Login realizado com sucesso!</div>`;
                            }
                            setTimeout(() => {
                                window.location.href = '../physician.html';
                            }, 1000);
                        } else {
                            if (outputResponse) {
                                outputResponse.innerHTML = `<div class="alert alert-danger">Erro: Não foi possível identificar o ID do médico.</div>`;
                            }
                        }
                    })
                    .catch(() => {
                        if (outputResponse) {
                            outputResponse.innerHTML = `<div class="alert alert-danger">Erro ao buscar informações do médico.</div>`;
                        }
                    });
            } else {
                // Tenta encontrar o ID do médico em diferentes campos
                let physicianId = data._id || data.id || data.physicianId || (data.physician && (data.physician._id || data.physician.id));
                let physicianName = data.name || data.username || (data.physician && (data.physician.name || data.physician.username)) || '';
                if (!physicianId) {
                    if (outputResponse) {
                        outputResponse.innerHTML = `<div class="alert alert-danger">Erro: Não foi possível identificar o ID do médico retornado pela API.</div>`;
                    }
                    return;
                }
                localStorage.setItem('physicianId', physicianId);
                localStorage.setItem('physicianName', physicianName);
                if (outputResponse) {
                    outputResponse.innerHTML = `<div class="alert alert-success">Login realizado com sucesso!</div>`;
                }
                setTimeout(() => {
                    window.location.href = '../physician.html';
                }, 1000);
            }
        })
        .catch((error) => {
            console.error('Erro no login:', error);
            if (outputResponse) {
                outputResponse.innerHTML = `<div class="alert alert-danger">Ocorreu um erro ao fazer login: ${error.message}</div>`;
            }
        });
    });