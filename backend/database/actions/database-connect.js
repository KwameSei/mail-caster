import connection from "../mysql_connect.js";

connection.raw("show schemas")
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });

  // To connect to mysql database
  // node database/actions/database-connect.js