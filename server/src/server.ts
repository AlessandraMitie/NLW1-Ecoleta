import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
//use é usado como se botasse um plugin no express

//const users = [
        //neste caso será retornado um array
        //'Diego',
        //'Cleiton',
        //'Robson',
        //'Alessandra'
    //];

//criar rota
//o primeiro parametro é a rota /users
//o segundo parâmetro é uma função (que será executada assim que o usuário acessar a rota) e possui 2 parâmetros: request e response
//request será utiliado para obter dados da nossa requisição
//response será utilizado para enviar uma resposta para o navegador ou qualquer outra aplicação que esteja consumindo a rota
//app.get('/users', (request, response) => {
    //console.log('Listagem de usuários');

    //response.send('Hello World');
    //send é um método para retornar um texto simples

    //const search = String(request.query.search);
    //se forçar que é uma String, o sistema não vai esperar receber um array

    //if ternário:
    //se existe a informação de search, vai ser o users.filter(user....
    //se não, vai ser os próprios usuários
    //const filteredUsers = search ? users.filter(user => user.includes(search)) : users;
    //filter é um método que recebe uma função. Essa função recebe por parâmetro user.  vai verificar se user inclui dentro do texto dele o search

    //return response.json(filteredUsers);
//});

//app.get('/users/:id', (request, response) => {
    //const id = Number(request.params.id);

    //const user = users[id];

    //return response.json(user);
//});
//os dois pontos significa que estou recebendo um parâmetro que vai ser acessível dentro da requisição

//criar um usuário
//app.post('/users', (request, response) => {
    //const data = request.body;

    //const user = {
        //name: data.name,
        //email: data.email,
    //};

    //return response.json(user);
//});

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
//primeiro parâmetro é a rota uploads
//express.static é o segundo parâmetro e vai servir para servir arquivos estáticos de uma pasta específica

app.use(errors());

app.listen(3333);
//3333 é a porta da aplicação