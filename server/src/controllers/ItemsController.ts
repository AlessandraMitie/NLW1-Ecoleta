import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index (request: Request, response: Response) {
        const items = await knex('items').select('*');
        //quero buscar todos os campos da tabela items
        //é a mesma coisa que SELECT * FROM items
        //await serve para terminar a query terminar para entao ter os resultados
    
        const serializedItems = items.map(item => {
        //map percorre todos os items que retornei do banco de dados e pode retornar do jeito que quiser
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.15.8:3333/uploads/${item.image}`,
            };
        });
        return response.json(serializedItems);
    }
}

export default ItemsController;