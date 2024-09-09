const { DataTypes } = require('sequelize');
const sequelize = require('../config/config')

const User = sequelize.define('User', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true,
        }
    },
    phone: {
        type: DataTypes.INTEGER, // Use STRING to handle phone numbers
        allowNull: false,
        validate: {
            notEmpty: true,
            is: /^[0-9]+$/i,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [8, 100],
            is: /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/,
        },

    }, 
}, {
    timestamps: true,
    createdAt: true,

    // I want updatedAt to actually be called updateTimestamp
    updatedAt: true,

})


User.prototype.validPassword = function(password) {
    return this.password === password;
};

module.exports =User;
