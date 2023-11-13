const cpf = document.getElementById("cpf");
const password = document.getElementById("password");
const loginButton = document.getElementById("login-button");

const login = async () => {
  // Envia os dados do formulário para o servidor
  document.querySelector("form").submit();

  // Evita que a página seja recarregada
  window.location.href = "#";

  //   Evita que a página seja recarregada, porém está obsoleta
  //   event.preventDefault();

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
};
