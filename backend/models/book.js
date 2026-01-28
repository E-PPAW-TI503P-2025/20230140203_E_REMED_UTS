'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      this.hasMany(models.BorrowLog, { 
        foreignKey: 'bookId', 
        as: 'borrowLogs' 
      });
    }
  }

  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title cannot be empty" }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Author cannot be empty" }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0 
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });

  return Book;
};