const cpf = document.getElementById("cpf");
const password = document.getElementById("password");
const loginButton = document.getElementById("login-button");

const login = async () => {
  // Envia os dados do formulário para o servidor
  // document.querySelector("form").submit();

  // Evita que a página seja recarregada
  // window.location.href = "#";

  //   Evita que a página seja recarregada, porém está obsoleta
  event.preventDefault();

  await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cpf: cpf.value,
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
          if (!getCookieValue("Username") || !getCookieValue("CPF")) {
            console.log("distribuindo dados do usuário");
            document.cookie = document.cookie + ",Username:" + data.username;
            document.cookie = document.cookie + ",CPF:" + data.cpf;
          }
        }
      });
  }
};

const redirect = () => {
  console.log("documento cookie: ", document.cookie);
  if (document.cookie !== null || document.cookie !== undefined) {
    console.log("cookie detectado");
    window.location.href = "./user.html";
    console.log("fui usado");
  }
};

// Adding event listeners
loginButton.addEventListener("click", login);
