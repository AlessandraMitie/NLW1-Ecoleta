import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const upload = multer(multerConfig);

//instanciar classe:
const pointsController = new PointsController();
const itemsController = new ItemsController();

//quando cria os controlles, tem os mètodos neste formato:
//index   para listagem
//show    exibir um único registro
//create, update e delete ou desetroy
//create é o método dentro da classe que faz a criação
routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post(
    '/points', 
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.string().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
            //regex para validar que o item ta separado por vírgula
        })
    }, {
        abortEarly: false
        //faz todas as validações ao mesmo tempo
    }),
    pointsController.create
);

export default routes;

//Service Pattern
//Repository Pattern (Data Mapper)