const { Activity, Country } = require("../db");//importo activity y country del modelo
const { Op } = require("sequelize");

//CONTROLLER PARA MANEJAR LOS METODOS 

//funcion post para crear una actividad
const activitiesPost = async (req, res) => {

  try {
    const { name, difficulty, inicio, fin, season, countries } = req.body;//envia los datos por body
    //validaciones de los argumentos 
    if (!name) throw Error('Ingrese un nombre')
    if (!difficulty || difficulty < 1 || difficulty > 5) throw Error('Ingrese una dificultad entre 1 y 5')
    if (!inicio) throw Error('Ingrese una fecha de inicio')
    if (!fin) throw Error('Ingrese una fecha de fin')
    if (!season) throw Error('Ingrese una temporada valida')
    // constante que valida si la actividad ya exixte
    const findAct = await Activity.findOne({ where: { name: { [Op.iLike]: `${name}` } } });
    if (findAct) throw Error("Actividad ya existente!!! ingrese otro nombre a la actividad");
    //constante que crea la ctividad
    const activity = await Activity.create({ name, difficulty, inicio, fin, season });
      //variable que guarda el id de countries para vincular el pais con la actividad
      let countryacty = await Country.findAll({ where: { id: countries } });
    
    await activity.addCountries(countryacty);
    //retorno un ok si los datos se guardaron correctamente
    return res.status(200).send(activity);
  } catch (error) {
    //si no recibe los datos correctamente retorna el error
    return res.status(400).send({ msg: error.message });
  }
};

// creo la funcion get para poder realizar las consultas de las actividades
const activitiesGet = async (req, res) => {
  try {
    //variable en la que guardo la reouesta 
    const activity = await Activity.findAll()
    //retorno la repuesta si la peticion es correcta
    return res.status(200).send(activity);
  } catch (error) {
    //retorno error si la peticion no es correcta
    return res.status(400).send({ msg: error.message });
  }
}



module.exports = {
  activitiesPost,
  activitiesGet,
};



