/* Tela de entrada — apenas demonstração (não valida contas de verdade) */
const form = document.getElementById("form");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const aviso = document.getElementById("aviso");

document.getElementById("ver").addEventListener("click", () => {
  const mostrar = senha.type === "password";
  senha.type = mostrar ? "text" : "password";
  document.getElementById("ver").textContent = mostrar ? "Ocultar" : "Ver";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  [email, senha].forEach((c) => c.classList.remove("erro"));
  aviso.className = "aviso";

  const emailOk = /^\S+@\S+\.\S+$/.test(email.value.trim());
  if (!emailOk) {
    email.classList.add("erro");
    aviso.textContent = "Digite um e-mail válido para continuar.";
    return;
  }
  if (!senha.value.trim()) {
    senha.classList.add("erro");
    aviso.textContent = "Digite sua senha para continuar.";
    return;
  }

  aviso.className = "aviso ok";
  aviso.textContent = "Entrando...";
  form.querySelector(".btn").disabled = true;
  setTimeout(() => { window.location.href = "site.html"; }, 700);
});
