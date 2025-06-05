const password = document.getElementById("password");
const checkPassword = document.getElementById("check-password");
const email = document.getElementById("email");
const username = document.getElementById("username");
const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");
const URL = "https://governmental-rand-apparently-hairy.trycloudflare.com/api/users";

const getCookieValue = (cookieName) => {
  // Busca o cookie pelo nome correto (usando "=")
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies[i].split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return undefined;
};

const receiveUser = async () => {
  if (document.cookie) {
    if (
      getCookieValue("Session") === undefined ||
      getCookieValue("Session") === null
    ) {
      return;
    }
    await fetch(`${URL}/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionToken: getCookieValue("Session"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data.message !== "No user with that session" &&
          data.message !== "Invalid session"
        ) {
          // Verifica se o cookie já existe
          if (!getCookieValue("Username") || !getCookieValue("Email")) {
            document.cookie = `Username=${data.username}; path=/;`;
            document.cookie = `Email=${data.email}; path=/;`;
          }
        }
      });
  }
};

const redirect = () => {
  if (document.cookie !== null && document.cookie !== undefined) {
    window.location.href = "./user.html";
  }
};

const login = async () => {
  if (!email.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert", "alert-danger");
    negativeResponse.innerHTML = "Insira um email!";
    outputResponse.appendChild(negativeResponse);
    return;
  }
  if (!password.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert", "alert-danger");
    negativeResponse.innerHTML = "Insira uma senha!";
    outputResponse.appendChild(negativeResponse);
    return;
  }

  await fetch(`${URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "User not found") {
        const outputResponse = document.getElementById("output-response");
        while (outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
        const negativeResponse = document.createElement("div");
        negativeResponse.classList.add("alert", "alert-danger");
        negativeResponse.innerHTML = "Usuário não encontrado!";
        outputResponse.appendChild(negativeResponse);
        return;
      }
      // Corrigido: cookie nomeado corretamente
      document.cookie = `Session=${data.session}; path=/;`;
    });

  await receiveUser();
  await redirect();
};

const register = async () => {
  event.preventDefault();

  if (!email.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert", "alert-danger");
    negativeResponse.innerHTML = "Insira um email!";
    outputResponse.appendChild(negativeResponse);
    return;
  }
  if (!username.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert", "alert-danger");
    negativeResponse.innerHTML = "Insira um nome de usuário!";
    outputResponse.appendChild(negativeResponse);
    return;
  }
  if (!password.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert", "alert-danger");
    negativeResponse.innerHTML = "Insira uma senha!";
    outputResponse.appendChild(negativeResponse);
    return;
  }

  if (password.value !== checkPassword.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert", "alert-danger");
    negativeResponse.innerHTML = "Senhas não coincidem!";
    outputResponse.appendChild(negativeResponse);
    return;
  }

  await fetch(`${URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: password.value,
      email: email.value,
      username: username.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "User created successfully") {
        const outputResponse = document.getElementById("output-response");
        while (outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
        const positiveResponse = document.createElement("div");
        positiveResponse.classList.add("alert", "alert-success");
        positiveResponse.innerHTML = "Usuário criado com sucesso!";
        outputResponse.appendChild(positiveResponse);
      } else {
        const outputResponse = document.getElementById("output-response");
        while (outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
        const negativeResponse = document.createElement("div");
        negativeResponse.classList.add("alert", "alert-danger");
        negativeResponse.innerHTML = "Erro ao criar usuário!";
        outputResponse.appendChild(negativeResponse);
      }
    });
};

// Adding event listeners
if (loginButton) {
  loginButton.addEventListener("click", login);
}
if (registerButton) {
  registerButton.addEventListener("click", register);
}
