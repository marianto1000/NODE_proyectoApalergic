const express = require('express');
const usuariosRoutes = require('./routes/usuarios');
const alergiasRoutes = require('./routes/alergias');
const productosRoutes = require('./routes/productos');

require('dotenv').config();
require('./db.js');

const PORT = process.env.PORT;
const server = express();
server.use(express.static('public'));

server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.use('/usuarios', usuariosRoutes);
server.use('/alergias', alergiasRoutes);
server.use('/productos', productosRoutes);



server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
