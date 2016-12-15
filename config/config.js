var config = require('../index').config;



module.exports = {
  development: {
    username: 'yadaguru',
    password: 'yadaguru',
    database: 'yadaguru',
    host: 'postgres',
    dialect: 'postgresql'
  },
  test: {
    username: 'yadaguru',
    password: 'yadaguru',
    database: 'yadaguru_test',
    host: '127.0.0.1',
    dialect: 'postgresql'
  },
  qa: {
    use_env_variable: 'DATABASE_URL'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
}
