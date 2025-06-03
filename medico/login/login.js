document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const formData = {
            email: email,
            password: password
        };

        fetch('https://loved-pipeline-postage-receiving.trycloudflare.com/api/physicians/login', {
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
            //fazer a atualização para proxima pagina
        })
        .catch((error) => {
            console.error('Erro no login:', error);
            alert(`Ocorreu um erro ao fazer login: ${error.message}`);
        });
    });