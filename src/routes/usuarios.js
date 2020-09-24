const express = require('express');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middlewares/autentication');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Usuarios = require('../models/Usuarios');


const router = express.Router();

router.get('/', authenticateJWT, (req, res) => {
	Usuarios.find({})
		.then((usuario) => {
			res.send(usuario);
		})
		.catch((error) => {
			res.status(500).send(error);
		})
});



router.post('/', (req, res) => {

	
	const nombreCompleto = req.body.nombreCompleto
	const foto = req.body.foto
	const email = req.body.email
	const password = req.body.password
	const contact = req.body.contact
	const alimentos = req.body.alimentos

	bcrypt.hash(password, saltRounds, function (err, hash) {
		const usuario = new Usuarios()

		usuario.nombreCompleto = nombreCompleto;
		usuario.foto = foto;
		usuario.email = email;
		usuario.password = hash;
		usuario.contact = contact;
		usuario.alimentos = alimentos;


		usuario.save()
			.then((newUsuario) => {
				const accessToken = jwt.sign(
					{ userID: newUsuario._id, nombreCompleto: newUsuario.nombreCompleto },
					process.env.JWT_SECRET);
				return res.json({ logged : true, token: accessToken, usuario:newUsuario})
			})
			.catch((error) => {
				res.status(500).send(error);
			})
	});
});

/*router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	Usuarios.findOne({ email: email })
		.then((usuario) => {
			if (usuario) {
				bcrypt.compare(password, usuario.password, function (err, result) {
					if (result) {
						const accessToken = jwt.sign(
							{ userID: user._id, nombreCompleto: usuario.nombreCompleto },
							process.env.JWT_SECRET);
						return res.json({ logged: true, token: accessToken })
					}
					else {
						return res.status(404).json({ logged: false })
					}
				});
			}
			else {
				return res.status(404).json({ logged: false })
			}
		})
		.catch((err) => {
			return res.status(404).json({ logged: false })
		})
	});*/

	router.post('/login',  (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		Usuarios.findOne({ email : email })
			.then((usuario) => {
				if(usuario)
				{
					bcrypt.compare(password, usuario.password, function(err, result) {
						if(result)
						{
							const accessToken = jwt.sign(
								{ userID: usuario._id, nombreCompleto: usuario.nombreCompleto },
								process.env.JWT_SECRET);
							return res.json({ logged : true, token: accessToken})
						}
						else
						{
							return res.status(404).json({ logged : false})
						}
					});
				}
				else
				{
					return res.status(404).json({ logged : false})
				}
			})
			.catch((err)=>{
				return res.status(404).json({ logged : false})
			})
	});




router.get('/:id', (req, res) => {
	const id = req.params.id;
	Usuarios.findById(id, { __v: 0, updatedAt: 0, createdAt: 0 })
		.then((usuario) => {
			res.send(usuario)
		})
		.catch((error) => {
			res.status(500).send(error)
		})

});

router.delete('/:id', (req, res) => {
	const id = req.params.id

	Usuarios.findByIdAndDelete(id)
		.then((deletedUsuario) => {
			res.send({ mensaje: `se ha borrado correctamente el usuario con id ${id}` });
		})
		.catch((error) => {
			res.status(500).send(error);
		})
});

module.exports = router;
