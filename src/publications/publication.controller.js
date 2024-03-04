import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Publication from './publication.model.js';
import Usuario from '../users/user.model.js';

export const publicacionesGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };
    try {
        const [total, publicaciones] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .populate({
                    path: 'comentarios',
                    match: { estado: { $ne: false } }  
                })
                .skip(Number(desde))
                .limit(Number(limite))
        ]);
        const publicacionesFiltradas = publicaciones.map(pub => {
            const comentariosFiltrados = pub.comentarios.filter(com => com.estado !== false);
            return { ...pub.toObject(), comentarios: comentariosFiltrados };
        });

        res.status(200).json({
            total,
            publicaciones: publicacionesFiltradas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener las publicaciones',
            error: error.message
        });
    }
};


export const publicacionesPost = async (req, res) => {
    try {
        const { Titulo, Categoria, TextoPrincipal } = req.body;
        const usuarioId = req.usuario._id;
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no encontrado en la base de datos',
            });
        }
        const publicacion = new Publication({
            Titulo,
            Categoria,
            TextoPrincipal,
            Usuario: usuarioId,
            UsuarioNombre: usuario.nombre,
        });
        await publicacion.save();
        res.status(200).json({
            publicacion
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al crear la publicación',
        });
    }
};

export const getPublicacionById = async (req, res) => {
    const { id } = req.params;
    const publicacion = await Publication.findOne({ _id: id });

    res.status(200).json({
        publicacion
    })
}

export const publicacionesPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;
    try {
        if (!req.usuario || !req.usuario.nombre) {
            return res.status(401).json({
                msg: 'Token no válido o información de usuario no disponible',
            });
        }
        const publicacion = await Publication.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                msg: 'Publicación no encontrada',
            });
        }
        if (req.usuario.nombre !== publicacion.UsuarioNombre) {
            return res.status(401).json({
                msg: 'No tienes permisos para editar esta publicación',
            });
        }
        await Publication.findByIdAndUpdate(id, resto);
        const publicacionActualizada = await Publication.findOne({ _id: id });
        res.status(200).json({
            msg: 'Publicación actualizada',
            publicacion: publicacionActualizada,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al actualizar la publicación',
        });
    }
};

export const PublicacionDelete = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        if (!req.usuario || !req.usuario.nombre) {
            return res.status(401).json({
                msg: 'Token no válido o información de usuario no disponible',
            });
        }
        const publicacion = await Publication.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                msg: 'Publicación no encontrada',
            });
        }
        if (req.usuario.nombre !== publicacion.UsuarioNombre) {
            return res.status(401).json({
                msg: 'No tienes permisos para eliminar esta publicación',
            });
        }
        const publicacionEliminada = await Publication.findByIdAndUpdate(id, { estado: false });
        res.json({
            msg: 'Publicación eliminada exitosamente',
            publicacionEliminada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al eliminar la publicación',
        });
    }
};