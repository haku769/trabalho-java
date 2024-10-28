const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');

const app = express();
const router = express.Router();

const corsOption = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
} ;

app.use(express.json());
app.use(cors());
app.use(express.static("./pages")); // Para servir arquivos estáticos, se necessário

// Configuração de conexão com o banco de dados MySQL
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "PUC@1234",
  database: "trabalho_java" // Substitua pelo nome correto do seu banco de dados
});

con.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao MySQL!");
});

// Dados simulados em memória (substitua com interações reais com o banco de dados)
let idUsuarios = [];
const produtos = [];

/* ---------------------------------
   ROTAS PARA USUÁRIOS
--------------------------------- */

// Rota para obter todos os usuários

// Rota para obter todos os usuários
router.get("/api/usuarios", (req, res) => {
  let sql = "SELECT id, email, status FROM usuario";
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json(result); // Sucesso
  });
});

// Rota para criar ou atualizar um usuário
//router.post("/api/usuarios", (req, res) => {
  //const usuario = req.body;
  //let sql;
  //if (usuario.id) {
    // Atualiza usuário existente
    //sql = `UPDATE usuario SET email = ?, senha = ?, status = ? WHERE id = ?`;
    //con.query(sql, [usuario.email, usuario.senha, usuario.status ? 1 : 0, usuario.id], (err, result) => {
      //if (err) throw err;
      //res.status(200).json({ message: "Usuário atualizado", usuario }); // Sucesso
    //});
  //} else {
    // Cria novo usuário
    //sql = `INSERT INTO usuario (email, senha, status) VALUES (?, ?, ?)`;
   // con.query(sql, [usuario.email, usuario.senha, usuario.status ? 1 : 0], (err, result) => {
    //  if (err) throw err;
    //  usuario.id = result.insertId;
     // res.status(201).json({ message: "Usuário criado", usuario }); // Sucesso, recurso criado
    //});
 // }
//});

// Rota para capturar um usuário por ID
router.get("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  let sql = "SELECT id, email, status FROM usuario WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.status(404).json({ message: "Usuário não encontrado" }); // Falha
    res.status(200).json(result[0]); // Sucesso
  });
});

// Rota para excluir um usuário
router.delete("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  let sql = "DELETE FROM usuario WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado" }); // Falha
    res.status(200).send(`Usuário com id ${id} excluído`); // Sucesso
  });
});

// Endpoint para o login
router.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  const sql = `SELECT id, email FROM usuario WHERE email = ? AND senha = ? AND status = 1`;
  con.query(sql, [email, senha], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.status(404).json({ message: "Login inválido" }); // Falha: login inválido
    res.status(200).json(result[0]); // Sucesso
  });
});

router.post('/api/usuarios', (req, res) => {
  const { email, senha } = req.body;
  
  const sql = "INSERT INTO usuario (email, senha) VALUES (?, ?)";
  
  con.query(sql, [email, senha], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao criar usuário", err });
    }
    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  });
});




/* ---------------------------------
   ROTAS PARA PRODUTOS
--------------------------------- */

// Rota para obter todos os produtos
router.get("/api/crudProdutos", (req, res) => {
  res.status(200).json(produtos); // Sucesso
});

// Rota para obter um produto pelo ID
router.get("/api/crudProdutos/:id", (req, res) => {
  const { id } = req.params;
  const produto = produtos.find(produto => produto.id == id);

  if (produto) {
    return res.status(200).json(produto); // Sucesso
  }

  return res.status(404).json({ message: "Produto não encontrado" }); // Falha: produto não encontrado
});

// Rota para criar um novo produto
router.post("/api/crudProdutos", (req, res) => {
  const novoProduto = req.body;
  novoProduto.id = produtos.length + 1;
  produtos.push(novoProduto);
  res.status(201).json(novoProduto); // Sucesso, recurso criado
});

// Rota para atualizar um produto existente
router.put("/api/crudProdutos/:id", (req, res) => {
  const { id } = req.params;
  const produtoIndex = produtos.findIndex(produto => produto.id == id);

  if (produtoIndex !== -1) {
    produtos[produtoIndex] = { ...produtos[produtoIndex], ...req.body };
    return res.status(200).json(produtos[produtoIndex]); // Sucesso
  }

  return res.status(404).json({ message: "Produto não encontrado" }); // Falha: produto não encontrado
});

// Rota para deletar um produto
router.delete("/api/crudProdutos/:id", (req, res) => {
  const { id } = req.params;
  const produtoIndex = produtos.findIndex(produto => produto.id == id);

  if (produtoIndex !== -1) {
    produtos.splice(produtoIndex, 1);
    return res.status(204).send(); // Sucesso, sem conteúdo
  }

  return res.status(404).json({ message: "Produto não encontrado" }); // Falha
});

/* ---------------------------------
   INICIALIZAÇÃO DO SERVIDOR
--------------------------------- */

// Usar as rotas
app.use(router);

// Porta onde o servidor vai rodar
const port = 5502;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
