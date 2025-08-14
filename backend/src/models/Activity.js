const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Activity', {
    // idd:{
    //   type: DataTypes.STRING(3),
    //   allowNull: false, 
    //   primaryKey: true,
    // },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    difficulty:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      allowNull: false
    },
    inicio:{
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fin:{
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    season:{
      type: DataTypes.ENUM,
      values:["Spring", "Summer", "Autumm", "Winter" ],
      allowNull: false,
    },
//Temporada (])
  },
  { timestamps: false }
  );
};
