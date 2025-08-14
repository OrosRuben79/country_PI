const axios = require("axios");
const { Op } = require("sequelize");
const { Country, Activity } = require("../db");

// ---------------------- GET TODOS LOS PAISES ----------------------
const getCountriesAll = async (req, res) => {
  try {
    const { name } = req.query;

    // 1️⃣ Si hay un query de nombre, buscar en DB
    if (name) {
      const countriesFound = await Country.findAll({
        where: { name: { [Op.iLike]: `${name}%` } },
        attributes: { exclude: ["capital", "subregion"] },
        include: Activity,
      });
      return res.json(countriesFound);
    }

    // 2️⃣ Si DB está vacía, traer desde API externa y guardar
    const dbCount = await Country.count();
    if (dbCount === 0) {
      const response = (
        await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,capital,flags,region,continents,subregion,area,population,cca3"
        )
      ).data.map((c) => ({
        id: c.cca3,
        name: c.name.common,
        flag: c.flags?.png || "No flag",
        continent: c.continents?.[0] || "No continent",
        capital: c.capital?.[0] || "No capital",
        subregion: c.subregion || "No subregion",
        area: c.area || 0,
        population: c.population || 0,
      }));

      await Country.bulkCreate(response);
    }

    // 3️⃣ Traer todos los países desde DB
    const allCountries = await Country.findAll({
      attributes: ["id", "name", "flag", "continent", "population"],
      include: Activity,
    });

    return res.json(allCountries);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: error.message });
  }
};

// ---------------------- GET UN PAIS POR ID ----------------------
const getCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await Country.findByPk(id.toUpperCase(), {
      attributes: { exclude: ["capital", "subregion"] },
      include: Activity,
    });

    if (!country) return res.status(404).json({ msg: "Country no encontrado" });

    return res.json(country);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

// ---------------------- CREAR UN PAIS ----------------------
const postCountry = async (req, res) => {
  try {
    const { id, name, flag, continent, capital, subregion, area, population } = req.body;

    // Validaciones básicas
    if (!id || !name || !continent || !capital || !subregion || !area || !population)
      return res.status(400).json({ msg: "Faltan campos obligatorios" });

    const urlFlag = flag || "https://www.etsy.com/mx/listing/519358998/coleccion-de-banderas-del-mundo-clip-art";

    // Verificar si el país ya existe
    const existingCountry = await Country.findOne({ where: { name } });
    if (existingCountry) throw new Error("El país ya existe");

    const newCountry = await Country.create({
      id,
      name,
      flag: urlFlag,
      continent,
      capital,
      subregion,
      area,
      population,
    });

    return res.status(201).json(newCountry);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

// ---------------------- ACTUALIZAR UN PAIS ----------------------
const putCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, flag, continent, capital, subregion, area, population } = req.body;

    const country = await Country.findByPk(id.toUpperCase());
    if (!country) return res.status(404).json({ msg: "Country no encontrado" });

    await country.update({
      name,
      flag: flag || country.flag,
      continent,
      capital,
      subregion,
      area,
      population,
    });

    return res.json({ msg: "Country modificado con éxito", country });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

// ---------------------- ELIMINAR UN PAIS ----------------------
const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await Country.findByPk(id.toUpperCase());
    if (!country) return res.status(404).json({ msg: "Country no encontrado" });

    await country.destroy();
    return res.json({ msg: "Country eliminado correctamente", country });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

// ---------------------- EXPORTAR ----------------------
module.exports = {
  getCountriesAll,
  getCountry,
  postCountry,
  putCountry,
  deleteCountry,
};
