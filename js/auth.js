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

const receiveUser = () => {
  if (document.cookie) {
    console.log("receive user function used");
    fetch("http://localhost:5000/api/session", {
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
            document.cookie = document.cookie + ",Username:" + data.username;
            document.cookie = document.cookie + ",CPF:" + data.cpf;
          }
          if (
            window.location.href == "http://localhost:5500/login.html" ||
            window.location.href == "http://localhost:5500/" ||
            window.location.href == "http://localhost:5500/register.html"
          ) {
            window.location.href = "http://localhost:5500/user.html";
          }
        }
      });
  }
};

receiveUser();
