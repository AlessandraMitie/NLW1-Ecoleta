import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    //métodos:

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        //converter items em um array numérico:
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
            //trim vai retirar os espaçamentos

        //fazer query para o banco de dados:
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            //estou buscando todos os pontos em que pelo menos um item do filtro
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
            //buscar apenas todos os dados da tabela points

        const serializedPoints = points.map(point => {
        //map percorre todos os pontos que retornou do banco de dados
            return {
                ...point,
                image_url: `http://192.168.15.8:3333/uploads/${point.image}`,
            };
        });
        return response.json(serializedPoints);
        
        //console.log(city, uf, items);
        //return response.json(points);
    }

    async show(request: Request, response: Response) {
        //const id = request.params.id;
        //desestruturação:
        const { id } = request.params;

        //buscar o ponto de coleta:
        const point = await knex('points').where('id', id).first();
        //método first retorna um único registro

        if (!point) {
            return response.status(400).json({ message: 'Point not found.'});
        }

        const serializedPoint = {
            //vai ter todos os dados do point
            ...point,
            image_url: `http://192.168.15.8:3333/uploads/${point.image}`,
        };
        
        //SELECT * FROM items
        //JOIN point_items ON items.id = point_items.item_id
        //WHERE point_items.point_id = {id}

        const items = await knex('items')
        //quero listar todos os items que tem relação com esse ponto de coleta
            //fazer um join com a tabela point_items. Vou relacionar essa tabela. Fazer um join na tabela point_items onde o id do meu item da tabela items seja igual a point_items.item_id
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            //em que point_items.point_id é igual ao id
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point: serializedPoint, items });
        //vai retornar um objeto que vai retornar duas informações dentro do controller
    }

    async create (request: Request, response: Response) {
        //desestruturação de js: quando escreve tudo num objeto ao invés de
            //const name = request.body.name;
            //const email = request.body.email;
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        //transaction
        //para não deixar as outras queries executarem quando uma der erro
        const trx = await knex.transaction();

        const point = {
            //short sintaxe: quando o nome da variável é igual ao da propriedade do objeto, pode omitir e usar somente um nome ao invés de name: name
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
    
        //inserir todos os campos na tabela points:
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
            //items é um array de números
            //pointItems vai usar a funçao map para percorrer em items, vai retornar cada id (item_id) e vai retornar um objeto contendo item_id e point_id
                return {
                    item_id,
                    point_id,
                };
            })
        
        await trx('point_items').insert(pointItems);
    
        await trx.commit();
        //vai fazer os inserts nas bases de dados

        return response.json({ 
            //spread operator: pegar todas as instâncias que tenho dentro de um objeto e retorna dentro de outro:
            id: point_id,
            ...point,
        });
    }
}

export default PointsController;