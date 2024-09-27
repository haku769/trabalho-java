const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-Nome')
const sTipo = document.querySelector('#m-Tipo')
const sDescricao = document.querySelector('#m-Descricao')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome || '';  
    sTipo.value = itens[index].tipo || '';  
    sDescricao.value = itens[index].descricao || '';  
    id = index
  } else {
    sNome.value = '';
    sTipo.value = '';
    sDescricao.value = '';
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
    <td>${item.tipo}</td>
    <td>${item.descricao}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  e.preventDefault();
  
  if (sNome.value === '' || sTipo.value === '' || sDescricao.value === '') {
    console.error("Todos os campos precisam ser preenchidos.");
    return
  }

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].tipo = sTipo.value
    itens[id].descricao = sDescricao.value
  } else {
    itens.push({
      'nome': sNome.value,
       'tipo': sTipo.value,
        'descricao': sDescricao.value
      });
  }

  setItensBD()

  modal.classList.remove('active')

  loadItens()

  id = undefined
};

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

loadItens()