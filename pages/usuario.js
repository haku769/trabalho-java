const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sCPF = document.querySelector('#m-CPF');
const sEmail = document.querySelector('#m-Email');
const btnSalvar = document.querySelector('#btnSalvar');

let itens = [];
let id = null;

// Função genérica para chamadas de API
const apiRequest = async (url, method, body = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
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
const isValidCPF = cpf => /^\d{11}$/.test(cpf);

// Validação simples de Email
const isValidEmail = email => /\S+@\S+\.\S+/.test(email);

const carregarUsuario = async (id) => {
  try {
    const usuario = await apiRequest(`http://localhost:5501/api/usuarios`, 'GET');
    
    sNome.value = usuario.nome;
    sCPF.value = usuario.CPF;
    sEmail.value = usuario.Email;
  } catch (error) {
    console.error('Erro ao carregar o usuário:', error);
  }
};

function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sCPF.value = itens[index].CPF;
    sEmail.value = itens[index].Email;
    id = index;
  } else {
    sNome.value = '';
    sCPF.value = '';
    sEmail.value = '';
    id = null;
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
      itens[id] = user;
      await apiRequest(`http://localhost:5501/api/usuario/${id}`, 'PUT', user);
    } else {
      // Criar novo item
      itens.push(user);
      await apiRequest('http://localhost:5501/api/usuario', 'POST', user);
    }

    setItensBD();
    modal.classList.remove('active');
    loadItens();
    id = null;
  } catch (error) {
    alert('Ocorreu um erro ao salvar o usuário.');
  }
};

function loadItens() {
  try {
    itens = getItensBD();
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
      insertItem(item, index);
    });
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
  }
}

const getItensBD = () => {
  try {
    return JSON.parse(localStorage.getItem('dbfunc')) ?? [];
  } catch (error) {
    console.error('Erro ao acessar o banco de dados local:', error);
    return [];
  }
};

const setItensBD = () => {
  try {
    localStorage.setItem('dbfunc', JSON.stringify(itens));
  } catch (error) {
    console.error('Erro ao salvar no banco de dados local:', error);
  }
};

loadItens();
