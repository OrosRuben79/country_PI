const { Router } = require('express');
const cors = require('cors');
const countryRouter = require('./country.Routes.js')
const abilitiesRouter = require('./actibity.Routes.js')


// const router = Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const indexrouter = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
indexrouter.use(cors())
indexrouter.use("/countries", countryRouter);
indexrouter.use("/activities", abilitiesRouter);

module.exports = indexrouter;




