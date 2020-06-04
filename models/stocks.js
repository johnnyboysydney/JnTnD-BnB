module.exports = function(sequelize, DataTypes) {
  
  var Stock = sequelize.define("Stock", {
    type: {
      type: DataTypes.STRING,
      allowNull: true
      // ADD validation on room type
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  
  Stock.associate = function(models) {
          
    //Stock.hasOne(models.Room);
/*
    Res.belongsTo(models.Stock, {
      foreignKey: {
        allowNull: false
      }
    });
    */
//    Res.hasOne(models.Stock);
  }

  /*
  Table.associate = function(models) {
    Table.belongsTo(models.Guest, {
      onDelete: "cascade"
    });
  
  };
*/

  return Stock;
};