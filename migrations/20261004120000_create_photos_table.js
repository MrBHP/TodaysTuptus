/**
 * @param { import("knex").Knex } knex
 */
export function up(knex) {
  return knex.schema.createTable('photos', (table) => {
    table.increments('id')
    table.text('filename').notNullable().unique()
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 */
export function down(knex) {
  return knex.schema.dropTable('photos')
}
