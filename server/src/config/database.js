// require('dotenv').config();
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//     logging: process.env.NODE_ENV === 'development' ? console.log : false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   }
// );

// // Test the connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Database connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// module.exports = sequelize;



require('dotenv').config();
const { Sequelize } = require('sequelize');

// Parse the database URL
const dbUrl = 'postgresql://root:aA8ay4wkMHxFUnvGVdhMpjHGJH0T4W9T@dpg-cuo376l2ng1s73e29l40-a/tombola_draws';
const url = new URL(dbUrl);

const sequelize = new Sequelize({
  database: url.pathname.substring(1), // Remove the leading '/' from the pathname
  username: url.username,
  password: url.password,
  host: url.hostname,
  port: url.port || 5432, 
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;