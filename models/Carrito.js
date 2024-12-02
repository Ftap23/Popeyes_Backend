import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Combo } from "./Combo.js"
import { Combo_Extra } from "./Combo.js";

export const Carrito = sequelize.define(
    "Carrito",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        total: DataTypes.FLOAT,
        fecha_creacion: DataTypes.DATEONLY,
        fecha_actualizacion: DataTypes.DATEONLY,

        estado:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true //Para que se mantenga el nombre de la tabla
    }
);

export const ComboCarrito = sequelize.define(
    "ComboCarrito",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad: DataTypes.INTEGER,
        subtotal: DataTypes.FLOAT,
        estado: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
        }
    },{
        timestamps:false,
        freezeTableName:true
    }
);

Carrito.belongsToMany(Combo,{
    through: ComboCarrito
});

Combo.belongsToMany(Carrito,{
    through: ComboCarrito
});


//Relación entre combocaarrito y comboextra
ComboCarrito.hasMany(Combo_Extra, {
    foreignKey: "comboExtraId",
    sourceKey: "id"
});

Combo_Extra.belongsTo(ComboCarrito, {
    foreignKey: "comboExtraId",
    targetKey: "id"
});