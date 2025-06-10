const form = document.getElementById("form-agenda");
const lista = document.getElementById("lista-compromissos");
const inputData = document.getElementById("data");
const inputDesc = document.getElementById("descricao");
const inputPrioridade = document.getElementById("prioridade");
const filtroData = document.getElementById("filtro-data");

let compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];

function salvarCompromissos() {
  localStorage.setItem("compromissos", JSON.stringify(compromissos));
}

function ordenarPorData(lista) {
  return lista.sort((a, b) => new Date(a.data) - new Date(b.data));
}

function mostrarNotificacao(descricao) {
  if (Notification.permission === "granted") {
    new Notification("Novo compromisso adicionado!", {
      body: descricao,
      icon: "📅"
    });
  }
}

function renderizarCompromissos() {
  lista.innerHTML = "";
  const filtro = filtroData.value;

  let filtrados = [...compromissos];

  if (filtro) {
    filtrados = filtrados.filter(item => item.data === filtro);
  }

  ordenarPorData(filtrados).forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${item.data}</strong> - ${item.descricao} 
      <em style="color:${
        item.prioridade === "Alta"
          ? "red"
          : item.prioridade === "Média"
          ? "orange"
          : "green"
      }">[${item.prioridade}]</em></span>
      <button onclick="removerCompromisso(${index})">🗑️</button>
    `;
    lista.appendChild(li);
  });
}

function removerCompromisso(index) {
  compromissos.splice(index, 1);
  salvarCompromissos();
  renderizarCompromissos();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = inputData.value;
  const descricao = inputDesc.value.trim();
  const prioridade = inputPrioridade.value;

  if (!data || !descricao || !prioridade) return;

  compromissos.push({ data, descricao, prioridade });
  salvarCompromissos();
  renderizarCompromissos();
  mostrarNotificacao(descricao);
  form.reset();
});

filtroData.addEventListener("change", renderizarCompromissos);

document.addEventListener("DOMContentLoaded", () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  renderizarCompromissos();
});
