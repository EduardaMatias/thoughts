const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('thoughts', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

try {
  sequelize.authenticate();
  console.log('✅Banco de dados conectado');
} catch (err) {
  console.log(`❌Erro ao conectar: \n${err}`);
}

module.exports = sequelize;
