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



export const comentariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;
    try {
        if (!req.usuario || !req.usuario.nombre) {
            return res.status(401).json({
                msg: 'Token no válido o información de usuario no disponible',
            });
        }
        const comentario = await Comment.findById(id);
        if (!comentario) {
            return res.status(404).json({
                msg: 'Comentario no encontrado',
            });
        }
        if (req.usuario.nombre !== comentario.UsuarioNombre) {
            return res.status(401).json({
                msg: 'No tienes permisos para editar esta publicación',
            });
        }
        await Comment.findByIdAndUpdate(id, resto);
        const comentarioActualizado = await Comment.findOne({ _id: id });
        res.status(200).json({
            msg: 'Comentario actualizado',
            comentario: comentarioActualizado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al actualizar la publicación',
        });
    }
};

export const comentariosDelete = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        if (!req.usuario || !req.usuario.nombre) {
            return res.status(401).json({
                msg: 'Token no válido o información de usuario no disponible',
            });
        }
        const comentario = await Comment.findById(id);
        if (!comentario) {
            return res.status(404).json({
                msg: 'Comentario no encontrada',
            });
        }
        if (req.usuario.nombre !== comentario.UsuarioNombre) {
            return res.status(401).json({
                msg: 'No tienes permisos para eliminar este comentario',
            });
        }
        const comentarioEliminado = await Comment.findByIdAndUpdate(id, { estado: false });
        res.json({
            msg: 'Comentario eliminado exitosamente',
            comentarioEliminado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al eliminar el comentario',
        });
    }
};