import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Despacho = sequelize.define(
    "Despacho",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: DataTypes.STRING,
        
        estado:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true //Para que se mantenga el nombre de la tabla
    }
);