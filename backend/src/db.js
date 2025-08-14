require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Por favor define DATABASE_URL en tu archivo .env");
}

// Conexión a la base de datos
const sequelize = new Sequelize(DATABASE_URL, {
  logging: false, // cambiar a console.log para ver queries
  native: false,
});

const basename = path.basename(__filename);
const modelDefiners = [];

// Cargar todos los modelos de la carpeta /models
fs.readdirSync(path.join(__dirname, '/models'))
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && file.slice(-3) === '.js')
  .forEach(file => modelDefiners.push(require(path.join(__dirname, '/models', file))));

// Inyectar conexión a los modelos
modelDefiners.forEach(model => model(sequelize));

// Capitalizar nombres de los modelos
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([name, model]) => [name[0].toUpperCase() + name.slice(1), model]);
sequelize.models = Object.fromEntries(capsEntries);

// Relaciones entre modelos
const { Country, Activity } = sequelize.models;
Country.belongsToMany(Activity, { through: "country_activity" });
Activity.belongsToMany(Country, { through: "country_activity" });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
