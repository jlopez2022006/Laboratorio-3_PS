import { Router } from "express";
import { check } from "express-validator";
import {
  usuariosGet,
  usuariosPost,
  getUsuarioById,
  usuariosPut,
} from "./user.controller.js";
import {
  existenteEmail,
  existeUsuarioById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/", usuariosGet);

router.get(
  "/:id",
  [
    check("id", "It is not a valid ID").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  getUsuarioById
);

router.post(
  "/",
  [
    check("nombre", "The name is required").not().isEmpty(),
    check("password", "The password must be more than 6 characters.").isLength({min: 6,}),
    check("correo", "This is not a valid email").isEmail(),
    check("correo").custom(existenteEmail),
    validarCampos,
  ],
  usuariosPost
);

router.put(
  "/:id",
  [
    check("id", "It is not a valid ID").isMongoId(),
    check("password", "The password must be more than 6 characters.").isLength({min: 6,}),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  usuariosPut
);



export default router;
