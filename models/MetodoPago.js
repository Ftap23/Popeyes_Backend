import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Pago } from "./Pago.js";

export const MetodoPago = sequelize.define(
    "MetodoPago",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: DataTypes.STRING,

        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true //Para que se mantenga el nombre de la tabla
    }
);

MetodoPago.hasMany(Pago, {
    foreignKey: "metodoPagoid",
    sourceKey: "id"
});

Pago.belongsTo(MetodoPago, {
    foreignKey: "metodoPagoid",
    targetKey: "id"
});