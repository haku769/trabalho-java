const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sCPF = document.querySelector('#m-CPF')
const sTelefone = document.querySelector('#m-Telefone')
const sEmail = document.querySelector('#m-Email')
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
    sNome.value = itens[index].nome
    sCPF.value = itens[index].sCPF
    sTelefone.value = itens[index].sTelefone
    sEmail.value = itens[index].sEmail
    id = index
  } else {
    sNome.value = ''
    sCPF.value = ''
    sTelefone.value = ''
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
    <td>${item.sCPF}</td>
    <td>${item.sTelefone}</td>
    <td>${item.sEmail}</td>
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
  
  if (sNome.value == '' || sCPF.value == '' || sTelefone.value == ''|| sEmail.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].sCPF = sCPF.value
    itens[id].sTelefone = sTelefone.value
    itens[id].sEmail = sEmail.value
  } else {
    itens.push({'nome': sNome.value, 'CPF': sCPF.value, 'Telefone': sTelefone.value,'Email': sEmail.value})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

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