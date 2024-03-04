import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

export const usuariosGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};
    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
}

export const usuariosPost = async (req, res) => {
    const {nombre, correo, password} = req.body;
    const usuario = new User( {nombre, correo, password} );
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(200).json({
        msg: "Registered user!",
        usuario
    });
}

export const getUsuarioById = async (req, res) => {
    const {id} = req.params;
    const usuario = await User.findOne({_id: id});
    
    res.status(200).json({
        usuario
    })
}

export const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, oldPassword, correo, ...resto } = req.body;

    try {
        if (oldPassword && password) {
            const usuario = await User.findById(id);

            if (!bcryptjs.compareSync(oldPassword, usuario.password)) {
                return res.status(400).json({
                    msg: 'La contraseña anterior no es válida',
                });
            }
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }
        await User.findByIdAndUpdate(id, resto);
        const usuarioActualizado = await User.findOne({ _id: id });
        res.status(200).json({
            msg: 'Usuario actualizado',
            usuario: usuarioActualizado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al actualizar el usuario',
        });
    }
};

