const express = require('express');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middlewares/autentication');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Usuarios = require('../models/Usuarios');
let multer = require('multer');

const VALID_FILE_TYPES = ['image/png', 'image/jpg'];
const IMAGES_URL_BASE = "/profileImages";

const fileFilter = (req, file, cb) => {
	if (!VALID_FILE_TYPES.includes(file.mimetype)) {
	  cb(new Error('Invalid file type'));
	} else {
	  cb(null, true);
	}
  }


let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public' + IMAGES_URL_BASE)
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

let upload = multer({ storage: storage, fileFilter: fileFilter })



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



router.post('/', upload.single('foto'), (req, res) => {

	console.log(req.body);
	console.log(req.file);

	const nombreCompleto = req.body.nombreCompleto
	const foto = IMAGES_URL_BASE + "/" + req.file.filename
	const email = req.body.email
	const password = req.body.password
	const contact = req.body.contact
	

	bcrypt.hash(password, saltRounds, function (err, hash) {
		const usuario = new Usuarios()

		usuario.nombreCompleto = nombreCompleto;
		usuario.foto = foto;
		usuario.email = email;
		usuario.password = hash;
		usuario.contact = contact;
		


		usuario.save()
			.then((newUsuario) => {
				const accessToken = jwt.sign(
					{ userID: newUsuario._id, nombreCompleto: newUsuario.nombreCompleto },
					process.env.JWT_SECRET);
				return res.json({ logged: true, token: accessToken, usuario: newUsuario })
			})
			.catch((error) => {
				res.status(500).send(error);
			})
	});
});


router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	Usuarios.findOne({ email: email })
		.then((usuario) => {
			if (usuario) {
				bcrypt.compare(password, usuario.password, function (err, result) {
					if (result) {
						const accessToken = jwt.sign(
							{ userID: usuario._id, nombreCompleto: usuario.nombreCompleto },
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
});




router.get('/singleUser', authenticateJWT, (req, res) => {
	const id = req.usuario.userID;
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

router.put('/', authenticateJWT, (req, res) => {
	const id = req.usuario.userID
	let camposActualizar = {};
	//if (req.body.contactoEmergencia){
	//	camposActualizar.contactoEmergencia = req.body.contactoEmergencia
	//}
	//camposActualizar.alimentos = req.body.alimentos ? req.body.alimentos : undefined;
	//camposActualizar.contactoEmergencia = req.body.contactoEmergencia ? req.body.contactoEmergencia : undefined;

	camposActualizar = { ...req.body };
	//recoge todos los puntos del objeto body y los mete en el objeto nuevo//

	Usuarios.findByIdAndUpdate(id, camposActualizar)
		.then(() => {
			return Usuarios.findById(id);
		})
		.then((usuarioGuardado) => {
			res.json(usuarioGuardado);
		})
		.catch((error) => {
			res.status(500).send(error);
		})
});

router.post('/profileImage', authenticateJWT, upload.single('foto'), function (req, res, next) {

	console.log(req.file)

	Usuarios.findByIdAndUpdate(	req.user.userID,{

		foto: IMAGES_URL_BASE + "/" + req.file.filename
	})

	.then((err, updatedUser)=>{
		if(err){
			res.status(500).send(err)
		}else{
			res.send("imagen actualizada")
		}
	})


	const imageForm = document.getElementById('profileImageForm')
	imageForm.addEventListener('submit', (e)=> {
		e.preventDefault()
		const formData = new formData(imageForm)
		const userToken = localStorage.getItem('token')

		if (!userToken)
		{
			return window.location.href = "/Usuarios/login.html";
		}

		fetch('/usuarios/profileImage', {
			method: 'POST',
			body: formData,
			headers: {
				"Authorization": "Bearer" + userToken
			}
		})
		.then(respuesta => {
			console.log(respuesta.status)
		})
		.catch(err => {
			console.log(err)
		})
	})



});

module.exports = router;
