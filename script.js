const form = document.getElementById("form-agenda");
const lista = document.getElementById("lista-compromissos");
const inputData = document.getElementById("data");
const inputDesc = document.getElementById("descricao");
const inputPrioridade = document.getElementById("prioridade");
const filtroData = document.getElementById("filtro-data");

let compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];

// Salvar no localStorage
function salvarCompromissos() {
  localStorage.setItem("compromissos", JSON.stringify(compromissos));
}

// Ordenar por data 
function ordenarPorData(lista) {
  return lista.sort((a, b) => a.data.localeCompare(b.data));
}

// Notificação
function mostrarNotificacao(descricao) {
  if (Notification.permission === "granted") {
    new Notification("Novo compromisso adicionado!", {
      body: descricao,
      icon: "img/favicon.png"
    });
  }
}

// Formatar data BR
function formatarDataBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Renderizar lista
function renderizarCompromissos() {
  lista.innerHTML = "";
  const filtro = filtroData.value;
  let filtrados = [...compromissos];

  if (filtro) {
    filtrados = filtrados.filter(item => item.data === filtro);
  }

  if (filtrados.length === 0) {
    lista.innerHTML = "<li>Nenhum compromisso encontrado 😢</li>";
    return;
  }

  ordenarPorData(filtrados).forEach((item) => {
    const dataFormatada = formatarDataBR(item.data);

    const classePrioridade =
      item.prioridade === "Alta"
        ? "alta"
        : item.prioridade === "Média"
        ? "media"
        : "baixa";

    const li = document.createElement("li");
    li.classList.add("animar-entrada"); 
    li.innerHTML = `
      <span>
        <strong>${dataFormatada}</strong> - ${item.descricao}
        <em class="${classePrioridade}">[${item.prioridade}]</em>
      </span>
      <button onclick="removerCompromisso(${item.id})">🗑️</button>
    `;

    lista.appendChild(li);
  });
}

// Remover com confirmação 
function removerCompromisso(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  const item = document.querySelector(`button[onclick="removerCompromisso(${id})"]`).parentElement;

  item.classList.add("animar-saida");

  setTimeout(() => {
    compromissos = compromissos.filter(c => c.id !== id);
    salvarCompromissos();
    renderizarCompromissos();
  }, 300);
}

// Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = inputData.value;
  const descricao = inputDesc.value.trim();
  const prioridade = inputPrioridade.value;

  if (!data || !descricao || !prioridade) return;

  compromissos.push({
    id: Date.now(), 
    data,
    descricao,
    prioridade
  });

  salvarCompromissos();
  renderizarCompromissos();
  mostrarNotificacao(descricao);
  form.reset();
});

// Filtro
filtroData.addEventListener("change", renderizarCompromissos);

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  renderizarCompromissos();
});
