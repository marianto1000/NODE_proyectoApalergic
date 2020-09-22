const express = require('express');
const Productos = require('../models/Productos');

const router = express.Router();

router.get('/', (req, res) => {
    Productos.find({})
        .then((producto) => {
            res.send(producto);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
});



router.post('/', (req, res) => {
    const nombre = req.body.nombre
    const marca = req.body.marca
    const ingredientes = req.body.ingredientes
    const foto = req.body.foto
    const descripcion = req.body.descripcion
    const qr = req.body.qr

    const producto = new Productos()

    producto.nombre = nombre;
    producto.marca = marca;
    producto.ingredientes = ingredientes;
    producto.foto = foto;
    producto.descripcion = descripcion;
    producto.qr = qr;

    producto.save()
        .then((newProducto) => {
            res.json(newProducto);
        })
        .catch((error) => {
            res.send(error);
        })

});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Productos.findById(id, { __v: 0, updatedAt: 0, createdAt: 0 })
        .then((producto) => {
            res.send(producto)
        })
        .catch((error) => {
            res.status(500).send(error)
        })

});

router.delete('/:id', (req, res) => {
	const id = req.params.id

	Productos.findByIdAndDelete(id)
	.then((deletedProducto) => {
		res.send({mensaje: `se ha borrado correctamente el producto con id ${id}`});
	})
	.catch((error)=>{
		res.status(500).send(error);
	})
});


module.exports = router;