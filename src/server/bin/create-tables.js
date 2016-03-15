import bookshelf from '../bookshelf'
import log from '../log'

const knex = bookshelf.knex

Promise.resolve()
.then(() => knex.schema.hasTable('users')
  .then((exists) => {
    if (exists) {
      return
    }
    log.info('Creating `users` ...')
    return knex.schema.createTable('users', (table) => {
      table.increments('id')
      table.string('name')
      table.string('last_name')
      table.string('first_name')
      table.string('email').unique()
      table.string('hashed_password')
      table.string('salt')
      table.string('reset_password_token').index()
      table.dateTime('reset_password_expires')
      table.string('avatar', 512)
      table.string('phone', 20)
      table.dateTime('created_at').defaultTo(knex.fn.now())
    })
  })
)
.then(() => knex.schema.hasTable('blueprints')
  .then((exists) => {
    if (exists) {
      return
    }
    log.info('Creating `blueprints` ...')
    return knex.schema.createTable('blueprints', (table) => {
      table.string('id').primary()
      table.string('name')
      table.string('description')
      table.integer('user_id').unsigned().references('users.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.dateTime('created_at').defaultTo(knex.fn.now())
    })
  })
)
.then(() => knex.schema.hasTable('access_tokens')
  .then((exists) => {
    if (exists) {
      return
    }
    log.info('Creating `access_tokens` ...')
    return knex.schema.createTable('access_tokens', (table) => {
      table.string('token').primary()
      table.boolean('valid').defaultTo(true)
      table.string('blueprint_id').references('blueprints.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.dateTime('created_at').defaultTo(knex.fn.now())
    })
  })
)
.then(() => {
  log.info('All tables created successfully!')
  knex.destroy()
})
.catch((err) => {
  log.error(err)
  knex.destroy()
})
