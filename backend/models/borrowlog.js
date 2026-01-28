'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BorrowLog extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      this.belongsTo(models.User, { 
        foreignKey: 'userId', 
        as: 'user' 
      });
      
    
      this.belongsTo(models.Book, { 
        foreignKey: 'bookId', 
        as: 'book' 
      });
    }
  }

  BorrowLog.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrowDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, 
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true, 
      }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
      }
    }
  }, {
    sequelize,
    modelName: 'BorrowLog',
  });

  return BorrowLog;
};