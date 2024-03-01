import User from '../users/user.model.js'
import Publication from '../publications/publication.model.js'


export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({correo});
    if (existeEmail){
        throw new Error(`This email ${correo} already exists`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    if (!existeUsuario){
        throw new Error(`User with ID: ${id} don't exists`);
    }
}

export const existePublicacionById = async (id = '') => {
    const existePublicacion = await Publication.findById(id);
    if (!existePublicacion){
        throw new Error(`Publication with ID: ${id} don't exists`);
    }
}


