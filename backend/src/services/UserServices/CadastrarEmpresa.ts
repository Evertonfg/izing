import * as Yup from "yup";
import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  AutoIncrement,
  Default,
  HasMany,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";



import AppError from "../../errors/AppError";
import User from "../../models/User";
import Tenent from "../../models/Tenant";
import Whats from "../../models/Whatsapp";
import {  Sequelize,QueryInterface } from "sequelize";

const dbConfig = require("../../config/database");

let tenantID: string|number = "";

interface Request {
  email: string;
  password: string;
  name: string;
  empresa: string;
  profile?: string;
}


interface Response {
  email: string;
  name: string;
  id: number;

}

interface Empresa{
 codempresa : string|number;
}


const status='active';
let businessHours='[{"day": 0, "hr1": "08:00", "hr2": "12:00", "hr3": "14:00", "hr4": "18:00", "type": "O", "label": "Domingo"}, {"day": 1, "hr1": "08:00", "hr2": "12:00", "hr3": "14:00", "hr4": "18:00", "type": "O", "label": "Segunda-Feira"}, {"day": 2, "hr1": "08:00", "hr2": "12:00", "hr3": "14:00", "hr4": "18:00", "type": "O", "label": "Terça-Feira"}, {"day": 3, "hr1": "08:00", "hr2": "12:00", "hr3": "14:00", "hr4": "18:00", "type": "O", "label": "Quarta-Feira"}, {"day": 4, "hr1": "08:00", "hr2": "12:00", "hr3": "14:00", "hr4": "18:00", "type": "O", "label": "Quinta-Feira"}, {"day": 5, "hr1": "08:00", "hr2": "12:00", "hr3": "14:00", "hr4": "18:00", "type": "O", "label": "Sexta-Feira"}, {"day": 6, "hr1": "08:00", "hr2": "12:00", "hr3": "14:00", "hr4": "18:00", "type": "O", "label": "Sábado"}]';
const messageBusinessHours='Olá! Fantástico receber seu contato! No momento estamos ausentes e não poderemos lhe atender, mas vamos priorizar seu atendimento e retornaremos logo mais. Agradecemos muito o contato.';
const profile='admin';
let vconfig='{"filtrosAtendimento":{"searchParam":"","pageNumber":1,"status":["open","pending"],"showAll":true,"count":null,"queuesIds":[],"withUnreadMessages":false,"isNotAssignedUser":false,"includeNotQueueDefined":true},"isDark":false}'

businessHours = JSON.parse(businessHours);
vconfig = JSON.parse(vconfig);

const CadastrarEmpresa = async ({
  email,
  password,
  name,
  empresa,
  profile = "admin"
 }: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().required().min(2),
  //  tenantId: Yup.number().required(),
      email: Yup.string()
      .email()
      .required()
      .test(
        "Check-email",
        "An user with this email already exists.",
        async value => {
          const emailExists = await User.findOne({
            where: { email: value! }
          });
          return !emailExists;
        }
      ),
    password: Yup.string().required().min(5)
  });

  try {
    await schema.validate({ email, password, name });
  } catch (err) {
    throw new AppError(err.message);
  }

  const tenent = await Tenent.create({
    name:empresa,
    status,
    businessHours,
    messageBusinessHours
    
    
  });
  
 

  const user = await User.create({
    email,
    password,
    name,
    profile,
    tenantId: tenent.id,
    configs:vconfig
   
  });

   
  const sequelize = new Sequelize(dbConfig);

   const queryInterface = sequelize.getQueryInterface();
    const wh =  await queryInterface.sequelize.query(
   `  INSERT INTO public."Settings" ("key", value, "createdAt", "updatedAt", "tenantId", id) VALUES('userCreation', 'disabled', '2020-12-12 16:08:45.354', '2020-12-12 16:08:45.354', ${tenent.id}, 1);
      INSERT INTO public."Settings" ("key", value, "createdAt", "updatedAt", "tenantId", id) VALUES('NotViewTicketsQueueUndefined', 'disabled', '2020-12-12 16:08:45.354', '2020-12-12 16:08:45.354', ${tenent.id}, 2);
      INSERT INTO public."Settings" ("key", value, "createdAt", "updatedAt", "tenantId", id) VALUES('NotViewTicketsChatBot', 'disabled', '2020-12-12 16:08:45.354', '2020-12-12 16:08:45.354', ${tenent.id}, 3);
      INSERT INTO public."Settings" ("key", value, "createdAt", "updatedAt", "tenantId", id) VALUES('DirectTicketsToWallets', 'disabled', '2020-12-12 16:08:45.354', '2020-12-12 16:08:45.354', ${tenent.id}, 4);
      INSERT INTO public."Settings" ("key", value, "createdAt", "updatedAt", "tenantId", id) VALUES('NotViewAssignedTickets', 'disabled', '2020-12-12 16:08:45.354', '2020-12-12 16:08:45.354', ${tenent.id}, 6);
      INSERT INTO public."Settings" ("key", value, "createdAt", "updatedAt", "tenantId", id) VALUES('botTicketActive', '3', '2020-12-12 16:08:45.354', '2022-07-01 21:10:02.076', ${tenent.id}, 5);
      INSERT INTO public."Settings" ("key", value, "createdAt", "updatedAt", "tenantId", id) VALUES('ignoreGroupMsg', 'enabled', '2022-12-16 16:08:45.354' , '2022-12-16 21:10:02.076', ${tenent.id}, 7);
    `  

      );
    
  const id1 = tenent.id+1;
  const id2 = id1+1;
  const id3 = id2+1;
   const id4 = id3+1;
  
 

     const whats =  await queryInterface.sequelize.query(

  `INSERT INTO public."Whatsapps" ( "session", qrcode, status, battery, plugged, "createdAt", "updatedAt", "name", "isDefault", retries, "tenantId", phone, "number", "isDeleted", "tokenTelegram", "type", "instagramUser", "instagramKey", "tokenHook", "tokenAPI", "wabaBSP", "isActive", "fbPageId", "fbObject", "greetingMessage", "farewellMessage") VALUES( '', '', 'DISCONNECTED', '20', false, '2021-03-11 23:23:17.000', '2022-08-09 22:54:09.133', 'Whatsapp 01', true, 0, ${tenent.id}, '{}'::jsonb, '', false, NULL, 'whatsapp', NULL, NULL, '', NULL, NULL, true, NULL, NULL, 'Olá, meu nome é *{{nomeatendente}}* e vou dar prosseguimento no atendimento. _Atendimento nº *{{atendimentonumero}}*_', NULL);
 INSERT INTO public."Whatsapps" ( "session", qrcode, status, battery, plugged, "createdAt", "updatedAt", "name", "isDefault", retries, "tenantId", phone, "number", "isDeleted", "tokenTelegram", "type", "instagramUser", "instagramKey", "tokenHook", "tokenAPI", "wabaBSP", "isActive", "fbPageId", "fbObject", "greetingMessage", "farewellMessage") VALUES( '', '', 'DISCONNECTED', '20', false, '2021-03-11 23:23:17.000', '2022-07-19 16:19:59.332', 'Instagram 01', false, 0, ${tenent.id}, '{}'::jsonb, '', false, NULL, 'instagram', NULL, NULL, '', NULL, NULL, true, NULL, NULL, 'Olá, meu nome é *{{nomeatendente}}* e vou dar prosseguimento no atendimento. _Atendimento nº *{{atendimentonumero}}*_', NULL);
 INSERT INTO public."Whatsapps" ( "session", qrcode, status, battery, plugged, "createdAt", "updatedAt", "name", "isDefault", retries, "tenantId", phone, "number", "isDeleted", "tokenTelegram", "type", "instagramUser", "instagramKey", "tokenHook", "tokenAPI", "wabaBSP", "isActive", "fbPageId", "fbObject", "greetingMessage", "farewellMessage") VALUES( '', '', 'DISCONNECTED', '20', false, '2021-03-11 23:23:17.000', '2022-07-19 15:55:28.096', 'Telegram 01', false, 0, ${tenent.id}, '{}'::jsonb, '', false, NULL, 'telegram', NULL, NULL, '', NULL, NULL, true, NULL, NULL, 'Olá, meu nome é *{{nomeatendente}}* e vou dar prosseguimento no atendimento. _Atendimento nº *{{atendimentonumero}}*_', NULL);
 INSERT INTO public."Whatsapps" ( "session", qrcode, status, battery, plugged, "createdAt", "updatedAt", "name", "isDefault", retries, "tenantId", phone, "number", "isDeleted", "tokenTelegram", "type", "instagramUser", "instagramKey", "tokenHook", "tokenAPI", "wabaBSP", "isActive", "fbPageId", "fbObject", "greetingMessage", "farewellMessage") VALUES( '', '', 'DISCONNECTED', '20', false, '2021-03-11 23:23:17.000', '2022-07-19 15:55:28.096', 'Messenger 01', false, 0, ${tenent.id}, '{}'::jsonb, '', false, NULL, 'messenger', NULL, NULL, '', NULL, NULL, true, NULL, NULL, 'Olá, meu nome é *{{nomeatendente}}* e vou dar prosseguimento no atendimento. _Atendimento nº *{{atendimentonumero}}*_', NULL);
 `    
           );
        

 
  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
       
  };

  return serializedUser;
};

export default CadastrarEmpresa;
