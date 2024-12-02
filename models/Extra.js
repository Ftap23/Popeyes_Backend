import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Extra = sequelize.define(
    "Extra", {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        nombre: DataTypes.STRING,
        tipo: DataTypes.STRING,
        
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    }, {
        freezeTableName: true //Para que se mantenga el nombre de la tabla
    }
);

