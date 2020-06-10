import Knex from 'knex';
//Knex está com K maiúsculo porque está se referindo ao tipo da variável, pois não é um tipo primitivo da linguagem (como um string, boolean etc)

export async function up(knex: Knex) {
//função up serve para realizar as alterações que precisa no banco. ex criar a tabela
//o tipo do knex é Knex
    return knex.schema.createTable('points', table => {
        //createTable é uma função
        //points é o primeiro parâmetro e é o nome da tabela
        //o segundo parâmetro é uma função que recebe como parâmetro a referência para a tabela para criar os campos
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
        //o segundo parâmetro (no caso, 2) é a quantidade de caracteres do campo
    }); 
}

export async function down(knex: Knex) {
    //vai fazer o contrátio do up. voltar atrás (deletar a tabela)
    //ex, se em up criou uma tabela, no down vai deletar
    return knex.schema.dropTable('points');
}