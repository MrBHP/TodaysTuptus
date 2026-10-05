/**
 * @param { import("knex").Knex } knex
 */
export function up(knex) {
  return knex.schema.createTable('walk_form', (table) => {
    table.increments('id')
    table.text('name').notNullable()
    table.text('email').notNullable()
    table.text('arguments')
    table.boolean('not_guys').notNullable().defaultTo(false)
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 */
export function down(knex) {
  return knex.schema.dropTable('walk_form')
}
