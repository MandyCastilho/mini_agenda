const form = document.getElementById("form-agenda");
const lista = document.getElementById("lista-compromissos");
const inputData = document.getElementById("data");
const inputDesc = document.getElementById("descricao");

let compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];

function salvarCompromissos() {
  localStorage.setItem("compromissos", JSON.stringify(compromissos));
}

function renderizarCompromissos() {
  lista.innerHTML = "";
  compromissos.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.data} - ${item.descricao}</span>
                    <button onclick="removerCompromisso(${index})">🗑️</button>`;
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

  if (!data || !descricao) return;

  compromissos.push({ data, descricao });
  salvarCompromissos();
  renderizarCompromissos();

  form.reset();
});

renderizarCompromissos();
