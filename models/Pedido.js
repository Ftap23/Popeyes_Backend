import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Usuario } from "./Usuario.js";
import { Combo_Extra } from "./Combo.js";
import { Local_Despacho } from "./Local.js";
import { TipoPedido } from "./TipoPedido.js";
import { Pago } from "./Pago.js";

export const Pedido = sequelize.define(
    "Pedido",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        total: DataTypes.FLOAT,
        fecha_creacion: DataTypes.DATEONLY,
        fecha_actualizacion: DataTypes.DATEONLY,
        numPedido: DataTypes.STRING,
        
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true //Para que se mantenga el nombre de la tabla
    }
);

export const PedidoDetalle = sequelize.define(
    "PedidoDetalle",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad: DataTypes.INTEGER,
        estado:{
                type: DataTypes.BOOLEAN,
                defaultValue: true
          }
    }, {
        timestamps:false,
        freezeTableName:true
    }
);

Pedido.belongsToMany(Combo_Extra,{
    through: PedidoDetalle
});

Combo_Extra.belongsToMany(Pedido,{
    through: PedidoDetalle
});




//Relación con usuario
Pedido.belongsTo(Usuario, {
    foreignKey: "usuarioId",
    targetKey: "id"
});

Usuario.hasMany(Pedido, {
    foreignKey: "usuarioId",
    sourceKey: "id"
});


//Relación con local_despacho
Pedido.belongsTo(Local_Despacho, {
    foreignKey: "localesDespachoId",
    targetKey: "id"
});

Local_Despacho.hasMany(Pedido, {
    foreignKey: "localesDespachoId",
    sourceKey: "id"
});

//relación con tipopedido
Pedido.belongsTo(TipoPedido,{
    foreignKey: "tipopedidoId",
    targetKey: "id"
});

TipoPedido.hasMany(Pedido,{
    foreignKey: "tipopedidoId",
    sourceKey: "id"
});


