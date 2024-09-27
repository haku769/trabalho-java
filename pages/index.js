var express = require('express');
var app = express();
app.use(express.json());

app.use(express.static('./pages'));

const usuarios = [];

const router = express.Router();
router.get('/api/usuario', (req, res) => {  
    res.status(200).json(usuarios);
});
router.post('/api/usuario', (req, res) => {  
    console.log('entrou no post');
    console.log(req.body);

    var novoUsuario = req.body;
    novoUsuario.id = usuarios.length + 1;
    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
});

app.use(router);

const port = 5501;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});