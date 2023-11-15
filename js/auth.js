const password = document.getElementById("password");
const checkPassword = document.getElementById("check-password");
const email = document.getElementById("email");
const username = document.getElementById("username");
const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");

const getCookieValue = (cookieName) => {
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

const receiveUser = async () => {
  if (document.cookie) {
    console.log("receive user function used");
    if (
      getCookieValue("Session") === undefined ||
      getCookieValue("Session" === null)
    ) {
      return;
    }
    await fetch("http://localhost:5000/api/session", {
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
        // Verifica se o usuário está logado
        if (
          data.message !== "No user with that session" ||
          data.message !== "Invalid session"
        ) {
          // Verifica se o cookie já existe
          if (!getCookieValue("Username") || !getCookieValue("Email")) {
            console.log("distribuindo dados do usuário");
            document.cookie = document.cookie + ",Username:" + data.username;
            document.cookie = document.cookie + ",Email:" + data.email;
          }
        }
      });
  }
};

const redirect = () => {
  console.log("documento cookie: ", document.cookie);
  if (document.cookie !== null || document.cookie !== undefined) {
    window.location.href = "./user.html";
  }
};

const login = async () => {
  // Envia os dados do formulário para o servidor
  // document.querySelector("form").submit();

  // Evita que a página seja recarregada
  // window.location.href = "#";

  //   Evita que a página seja recarregada, porém está obsoleta
  // event.preventDefault();

  if (!email.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    // outputResponse.removeChild(outputResponse.firstChild);
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert");
    negativeResponse.classList.add("alert-danger");
    negativeResponse.innerHTML = "Insira um email!";
    outputResponse.appendChild(negativeResponse);
    return;
  }
  if (!password.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    // outputResponse.removeChild(outputResponse.firstChild);
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert");
    negativeResponse.classList.add("alert-danger");
    negativeResponse.innerHTML = "Insira uma senha!";
    outputResponse.appendChild(negativeResponse);
    return;
  }

  await fetch("http://localhost:5000/api/login", {
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
      document.cookie = "Session:" + data.session;
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
    // outputResponse.removeChild(outputResponse.firstChild);
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert");
    negativeResponse.classList.add("alert-danger");
    negativeResponse.innerHTML = "Insira um email!";
    outputResponse.appendChild(negativeResponse);
    return;
  }
  if (!username.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    // outputResponse.removeChild(outputResponse.firstChild);
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert");
    negativeResponse.classList.add("alert-danger");
    negativeResponse.innerHTML = "Insira um nome de usuário!";
    outputResponse.appendChild(negativeResponse);
    return;
  }
  if (!password.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    // outputResponse.removeChild(outputResponse.firstChild);
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert");
    negativeResponse.classList.add("alert-danger");
    negativeResponse.innerHTML = "Insira uma senha!";
    outputResponse.appendChild(negativeResponse);
    return;
  }

  if (password.value !== checkPassword.value) {
    const outputResponse = document.getElementById("output-response");
    while (outputResponse.firstChild) {
      outputResponse.removeChild(outputResponse.firstChild);
    }
    // outputResponse.removeChild(outputResponse.firstChild);
    const negativeResponse = document.createElement("div");
    negativeResponse.classList.add("alert");
    negativeResponse.classList.add("alert-danger");
    negativeResponse.innerHTML = "Senhas não coincidem!";
    outputResponse.appendChild(negativeResponse);
    return;
  }

  console.log("Tentando criar usuário");
  await fetch("http://localhost:5000/api/register", {
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
      console.log("Segundo estágio");
      if (data.message == "User created successfully") {
        const outputResponse = document.getElementById("output-response");
        while (outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
        const positiveResponse = document.createElement("div");
        positiveResponse.classList.add("alert");
        positiveResponse.classList.add("alert-success");
        positiveResponse.innerHTML = "Usuário criado com sucesso!";
        outputResponse.appendChild(positiveResponse);
        console.log(data);
      } else {
        const outputResponse = document.getElementById("output-response");
        while (outputResponse.firstChild) {
          outputResponse.removeChild(outputResponse.firstChild);
        }
        const negativeResponse = document.createElement("div");
        negativeResponse.classList.add("alert");
        negativeResponse.classList.add("alert-danger");
        negativeResponse.innerHTML = "Erro ao criar usuário!";
        outputResponse.appendChild(negativeResponse);
        console.log(data);
      }
    });
};

// Adding event listeners
if (loginButton) {
  loginButton.addEventListener("click", login);
  console.log("login button event listener added");
}
if (registerButton) {
  registerButton.addEventListener("click", register);
}
