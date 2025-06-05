document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

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
            alert('Login realizado com sucesso!');

            // Se a resposta contém o email, mas não o id, buscar o id pelo email
            if (data.email === email && (!data._id && !data.id && !data.physicianId)) {
                // Buscar todos os médicos e encontrar o id pelo email
                fetch('https://governmental-rand-apparently-hairy.trycloudflare.com/api/physicians')
                    .then(res => res.json())
                    .then(physicians => {
                        const medico = physicians.find(p => p.email === email);
                        if (medico && medico._id) {
                            localStorage.setItem('physicianId', medico._id);
                            localStorage.setItem('physicianName', medico.name || medico.username || '');
                            window.location.href = '../physician.html';
                        } else {
                            alert('Erro: Não foi possível identificar o ID do médico.');
                        }
                    })
                    .catch(() => {
                        alert('Erro ao buscar informações do médico.');
                    });
            } else {
                // Tenta encontrar o ID do médico em diferentes campos
                let physicianId = data._id || data.id || data.physicianId || (data.physician && (data.physician._id || data.physician.id));
                let physicianName = data.name || data.username || (data.physician && (data.physician.name || data.physician.username)) || '';
                if (!physicianId) {
                    alert('Erro: Não foi possível identificar o ID do médico retornado pela API.');
                    return;
                }
                localStorage.setItem('physicianId', physicianId);
                localStorage.setItem('physicianName', physicianName);
                window.location.href = '../physician.html';
            }
        })
        .catch((error) => {
            console.error('Erro no login:', error);
            alert(`Ocorreu um erro ao fazer login: ${error.message}`);
        });
    });