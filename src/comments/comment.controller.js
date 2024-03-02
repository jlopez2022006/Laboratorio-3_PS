import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Publication from '../publications/publication.model.js';
import Usuario from '../users/user.model.js';
import Comment from './comment.model.js';



export const comentariosPost = async (req, res) => {
    try {
        const { idPublicacion, Comentario } = req.body;
        const usuarioId = req.usuario._id;
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no encontrado en la base de datos',
            });
        }
        const comentario = new Comment({
            idPublicacion,
            Comentario,
            Usuario: usuarioId,
            UsuarioNombre: usuario.nombre,
        });
        const publicacionExistente = await Publication.findById(idPublicacion);
        if (!publicacionExistente) {
            return res.status(400).json({
                msg: 'La publicacion no existe en la base de datos',
            });
        }
        await comentario.save();

        publicacionExistente.comentarios.push(comentario._id);
        await publicacionExistente.save();

        res.status(200).json({
            msg: 'Comentario subido exitosamente',
            comentario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al crear la publicación',
        });
    }
};



