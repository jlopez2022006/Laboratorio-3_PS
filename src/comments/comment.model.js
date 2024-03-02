import mongoose from 'mongoose';

const CommentsSchema = mongoose.Schema({
    UsuarioNombre: {
        type: String,
        default: '',
    },
    idPublicacion: {
        type: String,
        required: [true, 'El id de la publicacion es obligatorio' ],
    },
    Comentario: {
        type: String,
        required: [true, "The comment is required."],
    },
    img: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
    }
});

CommentsSchema.methods.toJSON = function () {
    const { __v, _id, idPublicacion, ...comments } = this.toObject();
    comments.uid = _id;
    return comments;
}

const Comentario = mongoose.model('Comment', CommentsSchema); 

export default Comentario;