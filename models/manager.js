module.exports = function() {
  const Manager = sequelize.define(
    "Manager",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      getterMethods: {
        isAdmin: function() {
          return this.getDataValue("isAdmin");
        }
      }
    }
  );
  return Manager;
};
