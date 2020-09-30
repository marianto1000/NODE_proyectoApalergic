const express = require('express');
const authenticateJWT = require ('../middlewares/autentication');
const Diario = require('../models/Diario');

const router = express.Router();

router.get('/',  (req, res) => {
    Diario.find({})
        .then((diario) => {
            res.send(diario);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
});

router.get('/singleUser', authenticateJWT, (req, res) => {
    const id = req.usuario.userID;
    Diario.findById(id, { __v: 0, updatedAt: 0, createdAt: 0 })
        .then((diario) => {
            res.send(diario)
        })
        .catch((error) => {
            res.status(500).send(error)
        })
});


router.post('/', authenticateJWT, (req, res) => {
    const nombreProducto = req.body.nombreProducto
    const notas = req.body.notas
    const fecha = req.body.fecha
    const imagen = req.body.imagen

    const diario = new Diario()

    diario.nombreProducto = nombreProducto;
    diario.notas = notas;
    diario.fecha = fecha;
    diario.imagen = imagen;


    diario.save()
        .then((newDiario) => {
            res.json(newDiario);
        })
        .catch((error) => {
            res.send(error);
        })

});

router.put("/", authenticateJWT, (req, res) => {
    const id = req.usuario.userID;

    let camposActualizar = {};


    camposActualizar = { ...req.body };

    Diario.findByIdAndUpdate(id, camposActualizar)
        .then(() => {
            return Diario.findById(id);
        })
        .then((diarioActualizado) => {
            res.send(diarioActualizado);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});




module.exports = router;

