import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Extra } from "./Extra.js";

export const Combo = sequelize.define(
    "Combo", {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        nombre: DataTypes.STRING,
        img: DataTypes.STRING,
        descripcion:DataTypes.STRING,
        precio:DataTypes.FLOAT,
        masvendido:DataTypes.BOOLEAN,
        
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    }, {
        freezeTableName: true //Para que se mantenga el nombre de la tabla
    }
);


export const Combo_Extra = sequelize.define(
    "Combo_Extra",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        seccion: DataTypes.STRING,
        estado:{
            type: DataTypes.BOOLEAN,
            defaultValue:true
        },

    },{
        timestamps:false,
        freezeTableName:true
    }
);

Extra.belongsToMany(Combo,{
    through: Combo_Extra
});

Combo.belongsToMany(Extra,{
    through: Combo_Extra
});