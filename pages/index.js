var express = require("express");
var app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use(express.static("./pages"));

const usuarios = [];

const router = express.Router();
router.get("/api/usuario", (req, res) => {
  res.status(200).json(usuarios);
});
router.post("/api/usuario", (req, res) => {
  console.log("entrou no post");
  console.log(req.body);

  var novoUsuario = req.body;
  novoUsuario.id = usuarios.length + 1;
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});
router.put('/api/usuario/:id', (req, res) => {
  const { id } = req.params;
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id == id);

  if (usuarioIndex !== -1) {
      usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...req.body };
      return res.status(200).json(usuarios[usuarioIndex]);
  }

  return res.status(404).json({ message: "Usuário não encontrado" });
});
router.delete('/api/usuario/:id', (req, res) => {
  const { id } = req.params;
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id == id);

  if (usuarioIndex !== -1) {
      usuarios.splice(usuarioIndex, 1);
      return res.status(204).send(); // Sucesso, mas sem conteúdo
  }

  return res.status(404).json({ message: "Usuário não encontrado" });
});

app.use(router);

const port = 5501;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
