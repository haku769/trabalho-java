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
router.get("/api/usuarios", (req, res) => {
  let sql = "SELECT id, email, status FROM usuario";
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json(result); // Sucesso
  });
});



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
  
  // Verifica no banco de dados se o email e a senha correspondem a um usuário
  let sql = `SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}'`;
  
  con.query(sql, function (err, result) {
      if (err) {
          console.error('Erro ao consultar o banco de dados:', err);
          return res.status(500).json({ message: 'Erro no servidor' });
      }

      if (result.length > 0) {
          // Se encontrou um usuário com as credenciais fornecidas, retorna sucesso
          res.status(200).json({ message: 'Login bem-sucedido', usuario: result[0] });
      } else {
          // Senão, retorna erro de credenciais inválidas
          res.status(401).json({ message: 'Credenciais inválidas' });
      }
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

router.get("/api/crudProdutos", async (req, res) => {
  try {
    const [produtos] = await db.execute("SELECT * FROM produtos");
    res.status(200).json(produtos); // Sucesso
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos" }); // Falha
  }
});

// Rota para obter um produto pelo ID
router.get("/api/crudProdutos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [produto] = await db.execute("SELECT * FROM produtos WHERE id = ?", [id]);

    if (produto.length > 0) {
      return res.status(200).json(produto[0]); // Sucesso
    }

    return res.status(404).json({ message: "Produto não encontrado" }); // Falha
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ message: "Erro ao buscar produto" }); // Falha
  }
});

// Rota para criar um novo produto
router.post("/api/crudProdutos", async (req, res) => {
  const { nome, codigo, preco } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO produtos (nome, codigo, preco) VALUES (?, ?, ?)",
      [nome, codigo, preco]
    );
    const novoProduto = { id: result.insertId, nome, codigo, preco };
    res.status(201).json(novoProduto); // Sucesso, recurso criado
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ message: "Erro ao criar produto" }); // Falha
  }
});

// Rota para atualizar um produto existente
router.put("/api/crudProdutos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, codigo, preco } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE produtos SET nome = ?, codigo = ?, preco = ? WHERE id = ?",
      [nome, codigo, preco, id]
    );

    if (result.affectedRows > 0) {
      const [produtoAtualizado] = await db.execute("SELECT * FROM produtos WHERE id = ?", [id]);
      return res.status(200).json(produtoAtualizado[0]); // Sucesso
    }

    return res.status(404).json({ message: "Produto não encontrado" }); // Falha
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ message: "Erro ao atualizar produto" }); // Falha
  }
});

// Rota para deletar um produto
router.delete("/api/crudProdutos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM produtos WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      return res.status(204).send(); // Sucesso, sem conteúdo
    }

    return res.status(404).json({ message: "Produto não encontrado" }); // Falha
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ message: "Erro ao deletar produto" }); // Falha
  }
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
