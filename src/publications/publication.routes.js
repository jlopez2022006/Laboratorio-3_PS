import { Router } from "express";
import { check } from "express-validator";
import {
    existePublicacionById,
} from "../helpers/db-validators.js";
import {
    PublicacionDelete,
    getPublicacionById,
    publicacionesGet,
    publicacionesPost,
    publicacionesPut
} from "./publication.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", publicacionesGet);

router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existePublicacionById),
        validarCampos,
    ],
    getPublicacionById
);

router.post(
    "/",
    [
        validarJWT,
        check("Titulo", "The title is required.").not().isEmpty(),
        check("Categoria", "The category is required.").not().isEmpty(),
        check("TextoPrincipal", "The text is required.").not().isEmpty(),
        validarCampos,
    ],
    publicacionesPost
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existePublicacionById),
        validarCampos,
    ],
    publicacionesPut
);

router.delete('/:id',
    [
        validarJWT
    ], 
    PublicacionDelete
);



export default router;
