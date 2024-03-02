import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { comentariosPost } from "./comment.controller.js";

import Publicacion from "../publications/publication.model.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("idPublicacion").custom(async (value) => {
            const publicacionExistente = await Publicacion.findOne({ _id: value });
            if (!publicacionExistente) {
                throw new Error("La publicacion no existe en la base de datos");
            }
            return true;
        }),
        check("Comentario", "The comment is required.").not().isEmpty(),
        validarCampos,
    ],
    comentariosPost
);






export default router;
