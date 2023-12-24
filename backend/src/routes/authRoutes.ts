import { Router } from "express";
import * as SessionController from "../controllers/SessionController";
import * as UserController from "../controllers/UserController";
import * as UserEmpresa from "../controllers/UserCreateEmpresaController";

const authRoutes = Router();

authRoutes.post("/signup", UserController.store);

authRoutes.post('/cadastro', UserEmpresa.cadastro);

authRoutes.post("/login", SessionController.store);
authRoutes.post("/logout", SessionController.logout);

authRoutes.post("/refresh_token", SessionController.update);


export default authRoutes;
