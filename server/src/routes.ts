import express from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
//instanciar classe:
const pointsController = new PointsController();
const itemsController = new ItemsController();

//quando cria os controlles, tem os mètodos neste formato:
//index   para listagem
//show    exibir um único registro
//create, update e delete ou desetroy
routes.get('/items', itemsController.index);
routes.post('/points', pointsController.create);
//create é o método dentro da classe que faz a criação
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;

//Service Pattern
//Repository Pattern (Data Mapper)