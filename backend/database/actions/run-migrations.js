import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connection from '../mysql_connect.js';
import promise from "bluebird";
import { readdir, readFile } from "fs/promises";

// Determine the current filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the database name from the connection configuration or environment variable
const db = connection.client.config.connection.database || process.env.DB_NAME || '';

// Function to replace all instances of a delimiter in a string
const replaceAll = (str, delimiter, replace) => {
  return str.split(delimiter).join(replace);
};

(async () => {
  try {
    // Define the migrations directory path
    const migrationsDir = join(__dirname, '../migrations');
    // Read all files in the migrations directory
    const files = await readdir(migrationsDir, 'utf-8');

    await promise.each(files, async (file) => {
      const data = await readFile(join(migrationsDir, file), 'utf-8');
      const sql = replaceAll(data, '{}', db);

      try {
        const response = await connection.raw(sql);
        console.log(response);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    console.log('Migration files run successfully');
  } catch (err) {
    console.log('Error reading or running migration files');
    throw err;
  }
})();