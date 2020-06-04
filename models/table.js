module.exports = function(sequelize, DataTypes) {
  var Table = sequelize.define("Table", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      validate:  {
        isEmail: true
      }
    },
    res_time: {
      type: DataTypes.TIME,
      allowNull:false
    },
    num_party: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
    
  });

  /*
  Table.associate = function(models) {
    Table.belongsTo(models.Guest, {
      onDelete: "cascade"
    });
  
  };
*/

  Table.associate = function(models) {
    Table.belongsTo(models.Guest, {
      foreignKey: {
        allowNull: false
      }
    });
  }

  return Table;
};