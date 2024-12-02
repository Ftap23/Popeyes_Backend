import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Despacho } from "./Despacho.js";

export const Local = sequelize.define(
    "Local",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: DataTypes.STRING,
        direccion: DataTypes.STRING,
        telefono: DataTypes.STRING,

        estado:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true //Para que se mantenga el nombre de la tabla
    }
    
);

//Relación muchos a muchos
export const Local_Despacho = sequelize.define(
    "Local_Despacho",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        estado:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },{
        timestamps:false,
        freezeTableName:true
    }
);

Local.belongsToMany(Despacho,{
    through: Local_Despacho
});

Despacho.belongsToMany(Local,{
    through: Local_Despacho
});