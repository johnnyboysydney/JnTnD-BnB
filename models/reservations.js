module.exports = function(sequelize, DataTypes) {
 
  var Res = sequelize.define("Res", {
    res_time: {
      type: DataTypes.TIME,
      allowNull:false
    },
    party_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true
    } /*,
    guestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1
    },*/
  });

  
  Res.associate = function(models) { 
/*         
    Res.belongsTo(models.Guest, {
      foreignKey: {
        allowNull: false
      }
    });

*/

    Res.belongsTo(models.Guest, {
      foreignKey: 'GuestId',
      as: 'guest',
      onDelete: 'CASCADE',
      constraints: false,  
      allowNull: true, 
      defaultValue: null
    });

    Res.belongsTo(models.Stock, {
      foreignKey: 'StockId',
      as: 'stock',
      onDelete: 'CASCADE',
      constraints: false,  
      allowNull: true, 
      defaultValue: null
    });

  }
/*
    Res.belongsTo(models.Stock, {
      foreignKey: {
        allowNull: false
      }
    });
    */
//    Res.hasOne(models.Stock);

  /*
  Table.associate = function(models) {
    Table.belongsTo(models.Guest, {
      onDelete: "cascade"
    });
  
  };
*/

  return Res;
};