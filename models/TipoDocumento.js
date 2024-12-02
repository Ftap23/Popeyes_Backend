import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Usuario } from "./Usuario.js";

export const TipoDocumento = sequelize.define(
    "TipoDocumento",{
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

Usuario.belongsTo(TipoDocumento, {
    foreignKey: "tipoDocid",
    targetKey: "id"
});

TipoDocumento.hasMany(Usuario, {
    foreignKey: "tipoDocid",
    sourceKey: "id"
});