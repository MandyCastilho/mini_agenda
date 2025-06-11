const form = document.getElementById("form-agenda");
const lista = document.getElementById("lista-compromissos");
const inputData = document.getElementById("data");
const inputDesc = document.getElementById("descricao");
const inputPrioridade = document.getElementById("prioridade");
const filtroData = document.getElementById("filtro-data");

let compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];

// Função para salvar no localStorage
function salvarCompromissos() {
  localStorage.setItem("compromissos", JSON.stringify(compromissos));
}

// Ordenar por data
function ordenarPorData(lista) {
  return lista.sort((a, b) => new Date(a.data) - new Date(b.data));
}

// Mostrar notificação
function mostrarNotificacao(descricao) {
  if (Notification.permission === "granted") {
    new Notification("Novo compromisso adicionado!", {
      body: descricao,
      icon: "📅"
    });
  }
}

// 👉 Função para formatar a data no estilo brasileiro
function formatarDataBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Renderizar a lista de compromissos
function renderizarCompromissos() {
  lista.innerHTML = "";
  const filtro = filtroData.value;
  let filtrados = [...compromissos];

  if (filtro) {
    filtrados = filtrados.filter(item => item.data === filtro);
  }

  ordenarPorData(filtrados).forEach((item, index) => {
    const dataFormatada = formatarDataBR(item.data);
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${dataFormatada}</strong> - ${item.descricao} 
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

// Remover compromisso
function removerCompromisso(index) {
  compromissos.splice(index, 1);
  salvarCompromissos();
  renderizarCompromissos();
}

// Evento ao submeter o formulário
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

// Evento ao mudar o filtro de data
filtroData.addEventListener("change", renderizarCompromissos);

// Carrega dados ao iniciar
document.addEventListener("DOMContentLoaded", () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  renderizarCompromissos();
});
