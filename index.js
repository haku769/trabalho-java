var express = require('express');
var app = express();
app.use(express.json());

app.use(express.static('./pages'));

const usuario = [];

const router = express.Router();
router.get('/api/usuario', (req, res) => {  
    console.log('entrou no get');
    res.status(200).json(usuario);
});
router.post('/api/usuario', (req, res) => {  
    console.log('entrou no post');
    console.log(req.body);

    var usuario = req.body;
    usuario.id = 1;

    usuario.push(usuario);
    res.status(201).json(usuario);
});

app.use(router);

const port = 5501;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});