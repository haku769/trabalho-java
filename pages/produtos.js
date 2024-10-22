const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sNome = document.querySelector("#m-Nome");
const sCategoria = document.querySelector("#m-Categoria");
const sDescricao = document.querySelector("#m-Descricao");
const btnSalvar = document.querySelector("#btnSalvar");

let itens = [];
let id = null;

// Função genérica para chamadas de API
const apiRequest = async (url, method, body) => {
  try {
    const response = await fetch(url, { method, body: body ? JSON.stringify(body) : undefined });
    return await response.json();
  } catch (error) {
    console.error('Erro   na requisição:', error);
    throw error;
  }
};

// Função para carregar os itens da API
const loadItens = async () => {
  try {
    itens = await apiRequest('http://localhost:5502/api/produtos', 'GET');
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
      insertItem(item, index);
    });
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
  }
};

// Função para abrir o modal (para criar ou editar)
function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sCategoria.value = itens[index].Categoria;
    sDescricao.value = itens[index].descricao;
    id = itens[index].id; // Mantém o ID do item para edição
  } else {
    sNome.value = "";
    sCategoria.value = "";
    sDescricao.value = "";
    id = null; // Novo item
  }
}

// Função para inserir um item no DOM
function insertItem(item, index) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.Categoria}</td>
    <td>${item.descricao}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Função para salvar (criar ou editar) um item
btnSalvar.onclick = async (e) => {
  e.preventDefault();

  // Validação dos campos
  if (sNome.value === "" || sCategoria.value === "" || sDescricao.value === "") {
    alert("Preencha todos os campos.");
    return;
  }

  const item = {
    nome: sNome.value,
    categoria: sCategoria.value,
    descricao: sDescricao.value,
  };

  try {
    if (id !== null) {
      // Atualizar item existente
      await apiRequest(`http://localhost:5502/api/produtos/${id}`, 'PUT', item);
      itens = itens.map((i) => (i.id === id ? item : i)); // Atualiza localmente
    } else {
      // Criar novo item
      const newItem = await apiRequest('http://localhost:5502/api/produtos', 'POST', item);
      itens.push(newItem); // Adiciona o novo item retornado
    }

    modal.classList.remove("active");
    loadItens(); // Recarrega os itens
  } catch (error) {
    alert("Ocorreu um erro ao salvar o item.");
  }
};

// Função para deletar um item
async function deleteItem(index) {
  try {
    await fetch(`http://localhost:5502/api/produtos/${itens[index].id}`, { method: 'DELETE' });
    itens.splice(index, 1); // Remove localmente
    loadItens();
  } catch (error) {
    console.error("Erro ao deletar o item:", error);
  }
}

// Função para editar um item (abrir o modal com o item para edição)
function editItem(index) {
  openModal(true, index);
}

// Carregar os itens ao iniciar a página
loadItens();