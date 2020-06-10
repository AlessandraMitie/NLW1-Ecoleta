import knex from 'knex';
import path from 'path';

const connection = knex({
//connection recebe knex com as informações do banco de dados
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname,'database.sqlite'),
        //essa função une caminhos
        //__dirname é uma variável global que retorna o diretório que o arquivo ta executando
        //dentro de database, quero criar o arquivo sqlite
    },
    useNullAsDefault: true,
});

export default connection;