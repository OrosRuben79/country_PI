const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Country', {
    id: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      allowNull: false, 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    flag: {
      type: DataTypes.STRING,
      allowNull: false,
      isUrl: true,
    },
    continent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capital: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subregion: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.INTEGER,
      allowNull: false,
      isNumeric: true,
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false,
      isNumeric: true,
    }
  },
    {
      timestamps: false,
    }
  );
};
