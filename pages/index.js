var express = require('express');
var app = express();
app.use(express.json());

app.use(express.static('./pages'));

const usuario = [];

const router = express.Router();
router.get('/api/usuario', (req, res) => {  
    res.status(200).json(usuario);
});
router.post('/api/usuario', (req, res) => {  
    console.log('entrou no post');
    console.log(req.body);
    var NovoUsuario = req.body;
    novoUsuario.id = 1;
    novoUsuario.push(usuario);
    res.status(201).json(usuario);
});

app.use(router);

const port = 5501;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});