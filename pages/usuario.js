const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sCPF = document.querySelector('#m-CPF')
const sEmail = document.querySelector('#m-Email')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id
const carregarUsuario = async (id) => {
  try {
    const response = await fetch(`http://localhost:5501/api/usuarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const usuario = await response.json();
    
    sNome.value = usuario.nome;
    sCPF.value = usuario.CPF;
    sEmail.value = usuario.Email;
  } catch (error) {
    console.error('Erro ao carregar o usuário:', error);
  }
}

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sCPF.value = itens[index].CPF
    sEmail.value = itens[index].Email
    id = index
  } else {
    sNome.value = ''
    sCPF.value = ''
    sEmail.value = ''
  }
  
}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

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
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = async (e) => {
  e.preventDefault();

  if (sNome.value === '' || sCPF.value === '' || sEmail.value === '') {
    return;
  }

  const user = {
    nome: sNome.value,
    CPF: sCPF.value,
    Email: sEmail.value,
  };

  // Se estiver editando um item existente
  if (id !== undefined) {
    itens[id].nome = sNome.value;
    itens[id].CPF = sCPF.value;
    itens[id].Email = sEmail.value;

    // Aqui você faria uma requisição PUT ou PATCH para atualizar o registro no backend
    await fetch('http://localhost:5501/api/usuario/${id}', {
      method: 'PUT', // ou PATCH
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

  } else {
    // Se estiver criando um novo item
    itens.push(user);

    // Chamada para a API com POST para salvar no backend
    await fetch('http://localhost:5501/api/usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  }

  setItensBD();
  modal.classList.remove('active');
  loadItens();
  id = undefined;
};


function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()