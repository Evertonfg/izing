
import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import CheckSettingsHelper from "../helpers/CheckSettings";
import AppError from "../errors/AppError";


import CadastrarEmpresa from "../services/UserServices/CadastrarEmpresa";


type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};



export const cadastro = async (req: Request, res: Response): Promise<Response> => {
  
  const { email, password, name, profile, empresa} = req.body;

  const user = await CadastrarEmpresa({
    email,
    password,
    name,
    empresa,
    profile,
 

  });
 

console.log(user);

  return res.status(200).json(user);
};

