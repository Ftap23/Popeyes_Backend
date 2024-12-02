import express, {json} from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { sequelize } from './database/database.js';
import { Direccion, Usuario_Direccion } from './models/Direccion.js';
import { TipoDocumento } from './models/TipoDocumento.js';
import { MetodoPago } from './models/MetodoPago.js';
import { Extra } from './models/Extra.js';
import { Local, Local_Despacho } from './models/Local.js';
import { Despacho } from './models/Despacho.js';
import { TipoPedido } from './models/TipoPedido.js';
import { Usuario } from './models/Usuario.js';
import { Pago } from './models/Pago.js';
import { Carrito, ComboCarrito } from './models/Carrito.js';
import { Combo, Combo_Extra } from './models/Combo.js';
import { Pedido, PedidoDetalle } from './models/Pedido.js';




const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json()); 
app.use(cors());

async function verificarConexion(){
    try {
        await sequelize.authenticate();
        console.log("Conexión a la DB exitosa")
        await sequelize.sync(/*{force:true}*/); //Sincroniza los cambios 
    } catch (error) {
        console.error("Ocurrió un error al conectarse a la DB", error)
    }
}

//Dirección
app.get("/direccion", async function(req, res){
    const direcActiva = await Direccion.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(direcActiva)
});

app.post("/direccion", async function(req, res){
    const data = req.body;
    if (data.nombre) {
        const nuevaDirecc = await Direccion.create(data);
        res.status(200).json(nuevaDirecc);
    }else{
        res.status(404).send("Error al crear")
    }
});

//Usuario_Direccion
app.get("/usuariodireccion", async function(req, res){
    const usudirecActivo = await Usuario_Direccion.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(usudirecActivo);
});

app.post("/usuariodireccion/:idUsuario/:idDireccion", async function(req, res){
    const usuario = await Usuario.findByPk(req.params.idUsuario);
    const direccion = await Direccion.findByPk(req.params.idDireccion);
    await usuario.addDireccion(direccion);

    res.status(200).send("Agregado de forma exitosa")
});

//Carrito
app.get("/carrito", async function(req, res){
    const carritoActivo = await Carrito.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(carritoActivo);
});

app.post("/usuario/:id/carrito", async function(req,res){
    const data = req.body;
    const nuevocarrito = await Carrito.create(data);
    const usuario = await Usuario.findByPk(req.params.id);
    usuario.addCarrito(nuevocarrito);
    res.status(200).json(nuevocarrito);
});

// Ver Combos
app.get("/combo", async function(req, res){
    const comboActivo = await Combo.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(comboActivo);
});

// Crear Combo
app.post('/combo', async (req, res) => {
    try {
        const { nombre, descripcion, precio, img, masvendido } = req.body;
        if (!nombre || !descripcion || !precio || !img || masvendido === undefined) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }
        const nuevoCombo = await Combo.create({
            nombre,
            descripcion,
            precio,
            img,
            masvendido,
        });
        res.status(201).json(nuevoCombo);
    } catch (error) {
        console.error('Error al crear combo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Combo especifico
app.get("/combo/:id", async function (req, res) {
    const { id } = req.params;
    try {
        const combo = await Combo.findByPk(id);
        if (combo) {
            res.status(200).json(combo);
        } else {
            res.status(404).send("Combo no encontrado");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener el combo");
    }
 });
 
// Actualizar un combo
app.put("/combo/:id", async function (req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
        const combo = await Combo.findByPk(id);

        if (!combo) {
            return res.status(404).send("Combo no encontrado");
        }
        const comboActualizado = await combo.update(data);
        res.status(200).json(comboActualizado);
    } catch (error) {
        console.error("Error al actualizar el combo:", error);
        res.status(500).json({ error: "Error al actualizar el combo" });
    }
});

// Eliminar un combo
app.delete("/combo/:id", async function (req, res) {
    const { id } = req.params;

    try {
        const combo = await Combo.findByPk(id);

        if (!combo) {
            return res.status(404).send("Combo no encontrado");
        }

        await combo.update({ estado: false });
        res.status(200).send("Combo eliminado correctamente");
    } catch (error) {
        console.error("Error al eliminar el combo:", error);
        res.status(500).json({ error: "Error al eliminar el combo" });
    }
});

//ComboExtra
app.get("/comboextra", async function (req, res){
    const comboextrActivo = await Combo_Extra.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(comboextrActivo);
});

app.post("/comboextra", async function(req, res) {
    try {
        const {seccion, ComboId, ExtraId} = req.body;

        const nuevoComboExtra = await Combo_Extra.create({
            ComboId,
            ExtraId,
            seccion
        });

        res.status(200).json(nuevoComboExtra);
    } catch (error) {
        console.error(error);
        res.status(404).send("Hubo un error al agregar el comboextra");
    }
});

// ACTUALIZAR COMBOEXTRA
app.put('/comboextra/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { seccion, estado } = req.body;

        const comboExtra = await Combo_Extra.findByPk(id);

        if (!comboExtra) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        await comboExtra.update({
            ...(seccion && { seccion }), 
            ...(estado !== undefined && { estado })
        });

        res.status(200).json({ message: 'Relación actualizada con éxito', data: comboExtra });
    } catch (error) {
        console.error('Error al actualizar la relación Combo_Extra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ELIMINAR COMBO EXTRA
app.delete('/comboextra/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const comboExtra = await Combo_Extra.findByPk(id);

        if (!comboExtra) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        await comboExtra.update({ estado: false });

        res.status(200).json({ message: 'Relación eliminada con éxito', data: comboExtra });
    } catch (error) {
        console.error('Error al eliminar la relación Combo_Extra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//ComboCarrito
app.get("/combocarrito", async function(req, res){
    const combocarritoActivos = await ComboCarrito.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(combocarritoActivos);
})

app.post("/combocarrito/:idCarrito/:idCombo/:idComboExtra/:cantidad/:subtotal", async (req, res) => {
    try {
        const { idCarrito, idCombo, idComboExtra, cantidad, subtotal } = req.params;
        const carrito = await Carrito.findByPk(idCarrito);
        const combo = await Combo.findByPk(idCombo);
        const comboextra = await Combo_Extra.findByPk(idComboExtra);
    
        if (!carrito || !combo || !comboextra) {
            return res.status(404).send("Carrito, Combo o ComboExtra no encontrado");
        }

        // Crear un nuevo ComboCarrito
        const nuevoComboCarrito = await ComboCarrito.create({
            carritoId: carrito.id,
            comboId: combo.id,
            cantidad: parseInt(cantidad),
            subtotal: parseFloat(subtotal)
        });

        return res.status(201).json({
            message: 'ComboCarrito creado exitosamente',
            data: nuevoComboCarrito
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Ocurrió un error");
    }
});


//PedidoDetalle
app.get("/pedidodetalle", async function (req, res) {
    const pedidodetalleActivo = await PedidoDetalle.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(pedidodetalleActivo);
});

app.post("/pedidodetalle/:idPedido/:idComboExtra/:cantidad", async function(req, res){
    try {
        const pedido = await Pedido.findByPk(req.params.idPedido);
        const comboextra = await Combo_Extra.findByPk(req.params.idComboExtra);

        await PedidoDetalle.create({
            cantidad: req.params.cantidad,
            PedidoId: pedido.id,
            ComboExtraId: comboextra.id
        });

        res.status(200).send("Agregado correctamente")
    } catch (error) {
        console.error(error);
        res.status(500).send("Hubo un error al agregar el pedidodetalle");
    }
});


//Pedido
app.get("/pedido", async function(req, res){
    const pedidoActivo = await Pedido.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(pedidoActivo);
});


app.post("/pedido/:idTipoPedido/:idUsuario/:idLocalDespacho/:idPago", async function(req, res) {
    try {
        // Desestructurar datos del cuerpo de la solicitud (req.body)
        const { total, fecha_creacion, fecha_actualizacion, numPedido } = req.body;

        // Verificar que los valores necesarios estén presentes
        if (!total || !fecha_creacion || !fecha_actualizacion) {
            return res.status(400).json({ message: "Faltan datos obligatorios en la solicitud." });
        }

        // Obtener las relaciones de las tablas por los parámetros de la URL
        const tipopedido = await TipoPedido.findByPk(req.params.idTipoPedido);
        const usuario = await Usuario.findByPk(req.params.idUsuario);
        const localdespacho = await Local_Despacho.findByPk(req.params.idLocalDespacho);
        const pago = await Pago.findByPk(req.params.idPago);

       

        // Crear el nuevo pedido
        const nuevoPedido = await Pedido.create({
            total,
            fecha_creacion,
            fecha_actualizacion,
            numPedido,
            usuarioId: usuario.id,      // Cambiar de idUsuario a usuarioId
            localesDespachoId: localdespacho.id, // Cambiar de idLocalDespacho a localesDespachoId
            tipopedidoId: tipopedido.id, // Cambiar de idTipoPedido a tipopedidoId
            pagoId: pago.id             // Cambiar de idPago a pagoId
        });
        

        // Responder con éxito
        res.status(201).json({ message: "Pedido creado exitosamente", nuevoPedido });

    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ message: "Error al crear el pedido", error: error.message });
    }
});


//TipoDocumento
app.get("/tipodocumento", async function(req, res){
    const tipdocActivo = await TipoDocumento.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(tipdocActivo);
});

app.post("/tipodocumento", async function(req, res){
    const data = req.body;
    if (data.nombre) {
        const nuevotipdoc = await TipoDocumento.create(data);
        res.status(200).json(nuevotipdoc);
    }else{
        res.status(404).send("Error al crear")
    }
});


//Usuario
app.get("/usuario", async function (req, res){
    const usuariosActivos = await Usuario.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(usuariosActivos);
});


/*app.post("/tipodocumento/:id/usuario", async function(req, res){
    const data = req.body;
    const nuevousuario = await Usuario.create(data);
    const tipodoc = await TipoDocumento.findByPk(req.params.id);
    tipodoc.addUsuario(nuevousuario);
    res.status(200).json(nuevousuario);
});*/

// SIGNUP
app.post('/usuario', async (req, res) => {
    try {
        const { contrasenia, tipoDocid, ...usuarioData } = req.body;

        if (!tipoDocid || isNaN(tipoDocid)) {
            return res.status(400).json({ error: 'El campo tipoDocid es requerido y debe ser un número válido' });
        }

        const tipoDocumento = await TipoDocumento.findByPk(tipoDocid);
        if (!tipoDocumento) {
            return res.status(404).json({ error: 'Tipo de documento no encontrado' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasenia, saltRounds);

        const nuevoUsuario = await Usuario.create({
            ...usuarioData,
            contrasenia: hashedPassword,
            tipoDocid,
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;

        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordMatch = await bcrypt.compare(contrasenia, usuario.contrasenia);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Si las credenciales son válidas, proceder (por ejemplo, generar un token)
        res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


//MetodoPago
app.get("/metodopago", async function(req, res){
    const metopagoActivo = await MetodoPago.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(metopagoActivo)
});

app.post("/metodopago", async function(req, res){
    const data = req.body;
    if (data.nombre) {
        const nuevometpago = await MetodoPago.create(data);
        res.status(200).json(nuevometpago);
    }else{
        res.status(404).send("Error al crear")
    }
});


//Pago
app.get("/pago", async function(req, res){
    const pagoActivo = await Pago.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(pagoActivo);
});

app.post("/metodopago/:id/pago", async function(req, res){
    const data = req.body;
    const nuevopago = await Pago.create(data);
    const metodopago = await MetodoPago.findByPk(req.params.id);
    metodopago.addPago(nuevopago);
    res.status(200).json(nuevopago)
});


//EXTRAS TODO
app.get("/extra", async function(req, res){
    const extraActivo = await Extra.findAll({
        where: {
            estado:true
        }
    });
    res.status(200).json(extraActivo);
});

//EXTRAS COMPLEMENTO
app.get("/extra_complemento", async function(req, res){
    const extraActivo = await Extra.findAll({
        where: {
            tipo: 'Complementos',
            estado:true
        }
    });
    res.status(200).json(extraActivo);
});

//EXTRAS BEBIDAS
app.get("/extra_bebida", async function(req, res){
    const extraActivo = await Extra.findAll({
        where: {
            tipo: 'Bebidas',
            estado:true
        }
    });
    res.status(200).json(extraActivo);
});

//EXTRAS SANDWICHES
app.get("/extra_sandwich", async function(req, res){
    const extraActivo = await Extra.findAll({
        where: {
            tipo: 'Sandwiches',
            estado:true
        }
    });
    res.status(200).json(extraActivo);
});

//EXTRAS TOSTYROLLS
app.get("/extra_tostyroll", async function(req, res){
    const extraActivo = await Extra.findAll({
        where: {
            tipo: 'Tosty Rolls',
            estado:true
        }
    });
    res.status(200).json(extraActivo);
});

//EXTRAS PIEZAS POLLO CLASICAS
app.get("/extra_pieza_pollo_clasica", async function(req, res){
    const extraActivo = await Extra.findAll({
        where: {
            tipo: 'Piezas de Pollo',
            estado:true
        }
    });
    res.status(200).json(extraActivo);
});

//EXTRAS PIEZAS POLLO PICANTES
app.get("/extra_pieza_pollo_picante", async function(req, res){
    const extraActivo = await Extra.findAll({
        where: {
            tipo: 'Piezas de Pollo Picantito',
            estado:true
        }
    });
    res.status(200).json(extraActivo);
});

app.post("/extra", async function(req, res){
    const data = req.body;
    if (data.nombre && data.tipo) {
        const nuevoExtra = await Extra.create(data);
        res.status(200).json(nuevoExtra);
    }else{
        res.status(404).send("Error al crear")
    }
});


//Locales
app.get("/local", async function(req, res){
    const localActivo = await Local.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(localActivo);
});

app.post("/local", async function(req, res){
    const data = req.body;
    if (data.nombre && data.direccion && data.telefono) {
        const nuevoLocal = await Local.create(data);
        res.status(200).json(nuevoLocal);
    }else{
        res.status(404).send("Error al crear")
    }
});


//Despacho
app.get("/despacho", async function(req, res){
    const despachoActivo = await Despacho.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(despachoActivo);
});

app.post("/despacho", async function(req, res){
    const data = req.body;
    if (data.nombre) {
        const nuevoDespacho = await Despacho.create(data);
        res.status(200).json(nuevoDespacho);
    }else{
        res.status(404).send("Error al crear")
    }
});


//Tipo Pedido
app.get("/tipopedido", async function(req, res){
    const tipedidoActivo = await TipoPedido.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).json(tipedidoActivo);
});

app.post("/tipopedido", async function(req, res){
    const data = req.body;
    if (data.nombre) {
        const nuevotipedido = await TipoPedido.create(data);
        res.status(200).json(nuevotipedido);
    }else{
        res.status(404).send("Error al crear")
    }
});


//Locales_Despacho
app.get("/localesdespacho", async function(req, res){
    const locdesActivo = await Local_Despacho.findAll({
        where:{
            estado:true
        }
    });
    res.status(200).send(locdesActivo)
});

app.get("/localesdespacho/:id", async function (req, res){
    const id = req.params.id;
    const localdespacho = await Local_Despacho.findByPk(req.params.id);
    if (localdespacho){

        res.status(200).json(localdespacho);
    }else{
        res.status(404).send("Error en la busqueda")
    }

});

app.post("/localesdespacho/:idLocal/:idDespacho", async function(req, res){
    const local = await Local.findByPk(req.params.idLocal);
    const despacho = await Despacho.findByPk(req.params.idDespacho);

    await local.addDespacho(despacho);

    res.status(200).send("Agregado exitosamente");
});













app.listen(PORT,()=> {
    console.log("Servidor activo en el puerto " + PORT);
    verificarConexion();
});
