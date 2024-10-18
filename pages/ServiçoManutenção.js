// Simula uma lista de serviços para manipulação
let listaServicos = [];
let editando = false;
let indiceEdicao = null;

// Função para abrir o modal
function openModal() {
    document.querySelector('.modal-container').style.display = 'block';
    limparFormulario();
    editando = false; // Define que não está editando
}

// Função para fechar o modal
function fecharModal() {
    document.querySelector('.modal-container').style.display = 'none';
}

// Função para limpar os campos do formulário
function limparFormulario() {
    document.getElementById('m-IdProduto').value = '';
    document.getElementById('m-NomeCliente').value = '';
    document.getElementById('m-DescricaoServico').value = '';
    document.getElementById('m-DataDevolucao').value = '';
    document.getElementById('m-Preco').value = '';
    document.getElementById('m-Status').value = '';
}

// Função para renderizar a tabela com os dados da lista de serviços
function renderizarTabela() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    listaServicos.forEach((servico, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${servico.idProduto}</td>
            <td>${servico.nomeCliente}</td>
            <td>${servico.descricaoServico}</td>
            <td>${servico.dataDevolucao}</td>
            <td>${servico.preco}</td>
            <td>${servico.status}</td>
            <td><button onclick="editarServico(${index})">Editar</button></td>
            <td><button onclick="excluirServico(${index})">Excluir</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para adicionar ou editar um serviço
document.getElementById('btnSalvar').addEventListener('click', (e) => {
    e.preventDefault();

    const idProduto = document.getElementById('m-IdProduto').value;
    const nomeCliente = document.getElementById('m-NomeCliente').value;
    const descricaoServico = document.getElementById('m-DescricaoServico').value;
    const dataDevolucao = document.getElementById('m-DataDevolucao').value;
    const preco = document.getElementById('m-Preco').value;
    const status = document.getElementById('m-Status').value;

    const novoServico = { idProduto, nomeCliente, descricaoServico, dataDevolucao, preco, status };

    if (editando) {
        // Atualiza o serviço existente
        listaServicos[indiceEdicao] = novoServico;
        editando = false;
    } else {
        // Adiciona novo serviço
        listaServicos.push(novoServico);
    }

    renderizarTabela();
    fecharModal();
});

// Função para editar um serviço
function editarServico(index) {
    const servico = listaServicos[index];
    document.getElementById('m-IdProduto').value = servico.idProduto;
    document.getElementById('m-NomeCliente').value = servico.nomeCliente;
    document.getElementById('m-DescricaoServico').value = servico.descricaoServico;
    document.getElementById('m-DataDevolucao').value = servico.dataDevolucao;
    document.getElementById('m-Preco').value = servico.preco;
    document.getElementById('m-Status').value = servico.status;

    openModal(); // Abre o modal com os dados preenchidos
    editando = true;
    indiceEdicao = index;
}

// Função para excluir um serviço
function excluirServico(index) {
    listaServicos.splice(index, 1);
    renderizarTabela();
}

// Fechar o modal ao clicar fora dele
document.querySelector('.modal-container').addEventListener('click', (e) => {
    if (e.target === document.querySelector('.modal-container')) {
        fecharModal();
    }
});
