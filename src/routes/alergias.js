const express = require('express');
const Alergias = require('../models/Alergias');
const authenticateJWT = require ('../middlewares/autentication')

const router = express.Router();

router.get('/', (req, res) => {
    Alergias.find({})
        .then((alergia) => {
            res.send(alergia);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
});



router.post('/', authenticateJWT, (req, res) => {
    const nombre = req.body.nombre

    const alergia = new Alergias()

    alergia.nombre = nombre;

    alergia.save()
        .then((newAlergia) => {
            res.json(newAlergia);
        })
        .catch((error) => {
            res.send(error);
        })

});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Alergias.findById(id, { __v: 0, updatedAt: 0, createdAt: 0 })
        .then((alergia) => {
            res.send(alergia)
        })
        .catch((error) => {
            res.status(500).send(error)
        })

});

router.delete('/:id', authenticateJWT, (req, res) => {
	const id = req.params.id

	Alergias.findByIdAndDelete(id)
	.then((deletedAlergia) => {
		res.send({mensaje: `se ha borrado correctamente el alimento alérgico con id ${id}`});
	})
	.catch((error)=>{
		res.status(500).send(error);
	})
});


module.exports = router;
