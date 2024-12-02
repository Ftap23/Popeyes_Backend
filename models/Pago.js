import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Pedido } from "./Pedido.js";

export const Pago = sequelize.define(
    "Pago",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        monto: DataTypes.FLOAT,
        fecha: DataTypes.DATEONLY,
        
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true //Para que se mantenga el nombre de la tabla
    }
);

//Relación con Pago
Pedido.belongsTo(Pago,{
    foreignKey: "pagoId",
    targetKey: "id"
})

Pago.hasMany(Pedido, {
    foreignKey: "pagoId",
    sourceKey: "id"
});