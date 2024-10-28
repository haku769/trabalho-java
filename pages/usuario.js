const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sNome = document.querySelector("#m-nome");
const sCPF = document.querySelector("#m-CPF");
const sEmail = document.querySelector("#m-Email");
const btnSalvar = document.querySelector("#btnSalvar");

let itens = [];
let id = null;

// Função genérica para chamadas de API
const apiRequest = async (url, method, body = null) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error(`Erro na requisição ${method} para ${url}:`, error);
    throw error; // Propaga o erro para tratamento
  }
};

// Validação simples de CPF (apenas formato)
const isValidCPF = (cpf) => /^\d{11}$/.test(cpf);

// Validação simples de Email
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const carregarUsuario = async (id) => {
  try {
    const usuario = await apiRequest(
      `http://localhost:5502/api/usuario/${id}`,

      "GET"
    );

    sNome.value = usuario.nome;
    sCPF.value = usuario.CPF;
    sEmail.value = usuario.Email;
  } catch (error) {
    console.error("Erro ao carregar o usuário:", error);
  }
};
// ao abrir o botao editar/excluir
function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    // Certifique-se de que o item existe e tenha um ID válido
    const item = itens[index];
    if (item && item.id) {
      sNome.value = item.nome;
      sCPF.value = item.CPF;
      sEmail.value = item.Email;
      id = item.id;  // Atribui o ID correto do item
    } else {
      console.error('Item inválido para edição:', item);
    }
  } else {
    sNome.value = '';
    sCPF.value = '';
    sEmail.value = '';
    id = null; // Para criar novo item
  }
}


function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  // Validação para garantir que o item tenha todas as propriedades e não seja nulo
  if (!item || !item.nome || !item.CPF || !item.Email) {
    console.warn(`Item inválido encontrado no índice ${index}:`, item);
    return;
  }

  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.CPF}</td>
    <td>${item.Email}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}


btnSalvar.onclick = async (e) => {
  e.preventDefault();

  // Validação dos campos
  if (sNome.value === '' || sCPF.value === '' || sEmail.value === '') {
    alert('Preencha todos os campos.');
    return;
  }

  if (!isValidCPF(sCPF.value)) {
    alert('CPF inválido. Deve conter 11 dígitos.');
    return;
  }

  if (!isValidEmail(sEmail.value)) {
    alert('Email inválido.');
    return;
  }

  const user = {
    nome: sNome.value,
    CPF: sCPF.value,
    Email: sEmail.value,
  };

  try {
    if (id !== null) {
      // Atualizar item existente
      const response = await apiRequest(`http://localhost:5502/api/usuario/${id}`, 'PUT', user);
      if (response) {
        itens = itens.map((i) => (i.id === id ? { ...i, ...user } : i)); // Atualiza o item no array local
      } else {
        console.error("Erro ao atualizar o usuário: resposta da API inválida");
      }
    } else {
      // Criar novo item
      const newUser = await apiRequest('http://localhost:5502/api/usuario', 'POST', user);
      itens.push(newUser); // Adiciona o novo item retornado pela API
      if (!newUser.id) {
        throw new Error("Erro: a API não retornou um ID para o novo usuário.");
      }
      itens.push(newUser);
      
    }

    setItensBD();
    modal.classList.remove('active');
    loadItens();
    id = null;
  } catch (error) {
    alert('Ocorreu um erro ao salvar o usuário.');
    console.error(error); // Log do erro para análise
  }
};


function loadItens() {
  try {
    itens = getItensBD(); // Carrega itens do localStorage
    tbody.innerHTML = '';

    // Filtrar itens válidos e remover os nulos ou indefinidos
    itens = itens.filter((item, index) => {
      if (item && item.nome && item.CPF && item.Email) {
        insertItem(item, index); // Insere o item válido
        return true; // Mantém no array
      } else {
        console.warn(`Item inválido encontrado no índice ${index}:`, item);
        return false; // Remove do array
      }
    });

    setItensBD(); // Atualiza o localStorage com itens filtrados
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
  }
}



const getItensBD = () => {
  try {
    const data = localStorage.getItem('dbfunc');
    return data ? JSON.parse(data) : []; // Retorna [] se não houver dados no localStorage
  } catch (error) {
    console.error('Erro ao acessar o banco de dados local:', error);
    return [];
  }
};


const setItensBD = () => {
  try {
    localStorage.setItem('dbfunc', JSON.stringify(itens)); // Salva o array atualizado
  } catch (error) {
    console.error('Erro ao salvar no banco de dados local:', error);
  }
};


loadItens();
