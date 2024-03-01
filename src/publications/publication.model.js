import mongoose from 'mongoose';

const PublicationsSchema = mongoose.Schema({
    UsuarioNombre: {
        type: String,
        default: '',
    },
    Titulo: {
        type: String,
        required: [true, "The title is required."],
    },
    Categoria: {
        type: String,
        required: [true, "The category is required."],
    },
    TextoPrincipal: {
        type: String,
        required: [true, "The text is required"],
    },
    img: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PublicationsSchema.methods.toJSON = function () {
    const { __v, _id, ...publications } = this.toObject();
    publications.uid = _id;
    return publications;
}

export default mongoose.model('Publication', PublicationsSchema);