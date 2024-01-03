const addTarefa = document.querySelector(".app__button--add-task");
const formAddTarefa = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
const ulTarefas = document.querySelector(".app__section-task-list");
const btnDeletar = document.querySelector(".app__form-footer__button--delete");
const btnCancelar = document.querySelector(".app__form-footer__button--cancel");
const paragrafoDescricaoTarefa = document.querySelector(
  ".app__section-active-task-description"
);
const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodas = document.querySelector("#btn-remover-todas");
const btnRemoverSelecionada = document.querySelector(
  "#btn-remover-selecionada"
);

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

// função para atualizar a lista do LocalStorage
function attTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// função para criar a lista"<li>" de tarefas
function criarElementoTarefa(tarefa) {
  // criando o <li class="app__section-task-list-item"><\li>
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");
  // criando o svg de confirmação da tarefa
  const svg = document.createElement("svg");
  svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;
  // criar paragrafo do elemento tarefa
  const paragrafo = document.createElement("p");
  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add("app__section-task-list-item-description");

  // criar o botão e a imagem de caneta do mesmo
  const botao = document.createElement("button");
  const imgBt = document.createElement("img");
  imgBt.setAttribute("src", "./imagens/edit.png");
  botao.classList.add("app_button-edit");
  botao.append(imgBt);
  // onclick do botao editar o elemento tarefa
  botao.onclick = () => {
    const newDscr = prompt("Qual é o novo nome da Tarefa?");
    if (newDscr) {
      paragrafo.textContent = newDscr;
      tarefa.descricao = newDscr;
      attTarefas();
      console.log("Nova Descrição da Tarefa: ", newDscr);
    } else {
      alert("Edição cancelada ou deixada em branco!");
    }
  };
  // adicionando na lista criada o svg, paragrafo e o botão.
  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  if (tarefa.completa) {
    li.classList.add("app__section-task-list-item-complete");
    botao.setAttribute("disabled", "disabled");
  } else {
    li.onclick = () => {
      document
        .querySelectorAll(".app__section-task-list-item-active")
        .forEach((elemento) => {
          // remover os active nas outras tarefas e deixa somente o principal
          elemento.classList.remove("app__section-task-list-item-active");
        });
      if (tarefaSelecionada == tarefa) {
        paragrafoDescricaoTarefa.textContent = "";
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
      } else {
        // alterar valor do paragrafo "#Em andamaneto" com a o valor da tarefa clickado
        tarefaSelecionada = tarefa;
        liTarefaSelecionada = li;
        paragrafoDescricaoTarefa.textContent = tarefa.descricao;
        li.classList.add("app__section-task-list-item-active");
      }
    };
  }
  // retorna a lista finalizada
  return li;
}
// Aparecer o form para adicionar a tarefa
addTarefa.addEventListener("click", () => {
  formAddTarefa.classList.toggle("hidden");
});

// pegar o submit do form e adicionar o object no LocalStorage
formAddTarefa.addEventListener("submit", (event) => {
  event.preventDefault();
  // const dscrTarefa = textArea.value;
  const tarefa = {
    descricao: textArea.value,
  };
  tarefas.push(tarefa);

  // Criar a ul no html
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
  // Atualizar a localStorage
  attTarefas();
  // limpar e esconder o form
  textArea.value = "";
  formAddTarefa.classList.add("hidden");
});

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
});
// limpar o formulário e esconde-lo novamente
const limparFormulario = () => {
  textArea.value = ""; // Limpe o conteúdo do textarea
  formAddTarefa.classList.add("hidden"); // Adicione a classe 'hidden' ao formulário para escondê-lo
};
// atribuindo cada fução a seu respectivo botão
btnCancelar.addEventListener("click", limparFormulario);
btnDeletar.addEventListener("click", () => {
  textArea.value = "";
});

// Identifica se a opção FOCO está selecionada pois não é para finalizar a tarefa com descanço.
document.addEventListener("focoFinalizado", () => {
  if (tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
    liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
    liTarefaSelecionada
      .querySelector("button")
      .setAttribute("disabled", "disabled");
    tarefaSelecionada.completa = true;
    paragrafoDescricaoTarefa.textContent = null;
    attTarefas();
  }
});

const removerTarefas = (somenteCompletas) => {
  // forma de entender esse seletor de baixo:
  //      let seletor = ".app__section-task-list-item"
  //      if (somenteCompletas) {
  //          seletor = ".app__section-task-list-item-complete"
  //      }
  const seletor = somenteCompletas
    ? ".app__section-task-list-item-complete"
    : ".app__section-task-list-item";
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somenteCompletas
    ? tarefas.filter((elemento) => !elemento.completa)
    : [];
  attTarefas();
};
const removerSelecionada = (e) => {
  const removerSelecionada = document.querySelector(
    ".app__section-task-list-item-active"
  );
  if (removerSelecionada == null || "") {
    alert("Nenhuma tarefa selecionada!");
  } else {
    removerSelecionada.remove();
    tarefas = e ? tarefas.filter((elemento) => !elemento.completa) : [];
    attTarefas();
  }
};

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);
btnRemoverSelecionada.onclick = () => removerSelecionada();

const pularTempo = document.querySelector("#Seconds");
pularTempo.onclick = () => (tempoDecorridoEmSegundos = 5);
