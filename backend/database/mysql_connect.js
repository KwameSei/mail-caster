import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

let config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true, // Allows multiple SQL statements in one query
  },
};

// Configuration for test database connection
if (process.env.NODE_ENV === "test") {
  config = {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST_TEST,
      user: process.env.DB_USER_TEST,
      password: process.env.DB_PASS_TEST,
      database: process.env.DB_NAME_TEST,
      port: process.env.DB_PORT_TEST,
      multipleStatements: true, // Allows multiple SQL statements in one query
    },
  };
}

// Configuration for production database connection
if (process.env.NODE_ENV === "production") {
  config = {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST_PROD,
      user: process.env.DB_USER_PROD,
      password: process.env.DB_PASS_PROD,
      database: process.env.DB_NAME_PROD,
      port: process.env.DB_PORT_PROD,
      multipleStatements: true, // Allows multiple SQL statements in one query
    },
  };
}

// Create a connection to the database
const connection = knex(config);

export default connection;


// To run the server, use either of the command below:
// NODE_ENV=development yarn dev
// NODE_ENV=test yarn test-env


// const poolConnect = createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   connectionLimit: 10,  // connection limit for each pool instance (default: 10)
// });

// poolConnect.getConnection((err, connection) => {
//   if (err) {
//     console.error('Error connecting to MySQL database:', err);
//     return;
//   }
//   console.log('Connected to MySQL database!');
//   connection.release(); // release the connection back to the pool
// });

// export default poolConnect;