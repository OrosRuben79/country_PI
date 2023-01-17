const axios = require("axios");
const { Op } = require("sequelize");
const { Country, Activity } = require("../db");

// const getAllCountries = async () => {
//   try {
//     const apiInfo = await getCountriesAll();
//     const dbInfo = await getInfoDb();
//     const allInfo = dbInfo.concat(apiInfo);
//     return allInfo;
//   } catch (error) {
//     console.log("entre al error del getcountries", error);
//   }
// };

const getCountriesAll = async (req, res) => {
  try {
    const { name } = req.query;//peticion por query

    if (name) {
      // Busqueda de ciudad por nombre no macheo exacto
      const getDB = await Country.findAll({
        where: { name: { [Op.iLike]: `${name}%` } },
        attributes: { exclud: ["capital", "subregion"] },
        include: Activity
      });
      return res.send(getDB);
    }

    // Busco la data en la api externa si mi db esta vacia
    if (!(await Country.findAll()).length) {
      const response = (
        await axios.get("https://restcountries.com/v3/all")
      ).data.map((c) => {
        return {
          id: c.cca3,
          name: c.name.common,
          flag: c.flags[0],
          continent: c.continents[0],
          capital: c.capital ? c.capital[0] : "not capital",
          subregion: c.subregion,
          area: c.area,
          population: c.population,
        };
      });
      // *** Guardando coutries a la base de datos ***
      await Country.bulkCreate(response);
    }
    // *Busqueda de todas las ciudades en la base de datos
    const getDB = await Country.findAll({
      attributes: ["id", "flag", "name", "continent", "population"],
      //incluye la actividad creada en la ruta de activity
      include: Activity,
    });


    //retorna la repuesta desde la base de datos
    return res.send(getDB);
  } catch (error) {
    // si la peticion no es correcta retorna el error
    return res.status(400).send({ msg: error.message });
  }

};

const getCountry = async (req, res) => {

  try {
    // *Busqueda de ciudad por id 
    const { id } = req.params;// peticion por params
    // Guardo en una constante la busqueda de los country
    const getDB = await Country.findAll({
      where: { id: id.toUpperCase() },
      attributes: { exclud: ["capital", "subregion"] },//excluyo los dos atributos
      include: Activity//incluyo la actividad existente
    });
    //responde ok 
    return res.send(getDB);

  } catch (error) {
    //responde error
    return res.status(400).send({ msg: error.message });
  }
};

const postCountry = async (req, res) => {
  try {
    const { id, name, flag, continent, capital, subregion, area, population } = req.body;// envia datos por body

    let urlDeImagen = "";
    if (flag) {
      urlDeImagen = flag;
    } else {
      urlDeImagen =
        "https://www.etsy.com/mx/listing/519358998/coleccion-de-banderas-del-mundo-clip-art";
    }

    //valido que la informacion que llega sea correcta
    if (!id) return res.status(404).send("Ingrese las tres primeras letras del name")
    if (!name) return res.status(404).send("Ingrese el nombre del Pais que desea crear")
    if (!flag) return res.status(404).send("Ingrese la url correspondiente a la bandera del pais que desea crear")
    if (!continent) return res.status(404).send("Ingrese el nombre del continente al que corresponde este pais")
    if (!capital) return res.status(404).send("Ingrese la capital");
    if (!subregion) return res.status(404).send("Ingrese la subregion");
    if (!area) return res.status(404).send("Ingrese el numero correspondiente al area del Pais")
    if (!population) return res.status(404).send("Ingrese el numero correspondiente a la poblacion del pais");

    //variavle en la que se guarda la consulta del pais en caso de que ya exista
    const findAct = await Country.findOne({ where: { name } });
    if (findAct) throw new Error("El Pais ya existe, ingrese uno que no este registrado");
    //creo el pais con el modelo establecido
    const country = await Country.create({ id, name, flag: urlDeImagen, continent, capital, subregion, area, population });

    //ok si se creo correctamente
    return res.status(200).send(country);

  } catch (error) {
    //retorna error si los datos no son correctos
    return res.status(400).send({ msg: error.message });
  }
};

const putCountry = async (req, res) => {
  try {
    const { id, name, flag, continent, capital, subregion, area, population } = req.body;
    
    const urlDeImagen = "";
      if (flag) {
        urlDeImagen = flag;
      } else {
        urlDeImagen =
          "https://www.etsy.com/mx/listing/519358998/coleccion-de-banderas-del-mundo-clip-art";
      }
   
    if (!id || !name || !flag || !continent || !capital || !subregion || !area || !population) {
      return res.status(403).json({ msg: "No contiene los elementos solicitados" })
    } 
    
    if(id && name ) { 
        const findCountry = await Country.findByPk(id);
        await findCountry.update(
          { id, name, flag, continent, capital, subregion, area, population },
          { where: { name: { [Op.iLike]: `${name}` } } }
        );

        
        const getDB = await Country.findAll({
          where: { id: id.toUpperCase() },
          exclud: Activity//incluyo la actividad existente
        });
       
        res.status(200).send("Country modificado con exito");

      } else {
        res.status(400).send("Faltaron datos para modificar el Country seleccionado")
      }
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }




const deleteCountry = async (req, res) => {
  const { id } = req.params;
  try {
    const countryDelete = await Country.findByPk(id);
    if (!countryDelete) {
      res.status(400).send("No existe el Country que deseas eliminar");
      
    } else {
      countryDelete.destroy();
      return res.status(200).send("Country eliminado correctamente",countryDelete);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCountriesAll,
  getCountry,
  postCountry,
  deleteCountry,
  putCountry,
};