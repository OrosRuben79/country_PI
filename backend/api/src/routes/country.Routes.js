const { Router } = require("express"); 
// const checkData = require("../middlewares/checkData");
const  {  
    getCountriesAll,
    getCountry, 
    postCountry, 
    putCountry,
    deleteCountry 
}  = require('../controllers/contCountry')



const countryRouter = Router();

countryRouter.get('/',getCountriesAll)

countryRouter.get('/:id',getCountry)
countryRouter.post('/', postCountry)
countryRouter.put('/edit/:id', putCountry)
countryRouter.delete('/delete/:id', deleteCountry)

module.exports = countryRouter;
