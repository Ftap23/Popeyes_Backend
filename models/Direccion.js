import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Usuario } from "./Usuario.js";


export const Direccion = sequelize.define(
    "Direccion",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: DataTypes.STRING,

        estado:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },{
        freezeTableName: true //Para que se mantenga el nombre de la tabla
    }
);

export const Usuario_Direccion = sequelize.define(
    "Usuario_Direccion",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },{
        timestamps:false,
        freezeTableName:true
    }
);

Direccion.belongsToMany(Usuario,{
    through: Usuario_Direccion
});

Usuario.belongsToMany(Direccion,{
    through: Usuario_Direccion
});

