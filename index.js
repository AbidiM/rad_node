const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const PORT = process.env.PORT || 9000

app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: 'rad'
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }

  const tableName = 'users';

  const checkTableExistsQuery = `
    SELECT *
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE() AND table_name = '${tableName}'
  `;

  con.query(checkTableExistsQuery, (err, results) => {
    if (err) {
      console.error('Error checking for table:', err);
      return;
    }

    if (results.length === 0) {
      // Table doesn't exist, create it
      const createTableQuery = `
      CREATE TABLE ${tableName} (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
      `;

      con.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          return;
        }

        console.log(`Table '${tableName}' created successfully.`);
      });
    } else {
      console.log(`Table '${tableName}' already exists.`);
    }
  });
});

app.get('/', (req, res) => {
  con.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result.length)
      res.send(result);
    }
  })
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email + " + " + password);

  con.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      if (result.length > 0) {
        res.send({ "result": result })
      }
      else {
        res.send({ "result": "not here" })
      }
    }
  })
})

app.post("/signup", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  console.log(name + " + " + email + " + " + password);

  con.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      if (result.length > 0) {
        res.send({ "result": "already exists" })
      }
      else {
        con.query("INSERT INTO users (username, email, password) VALUES(?,?,?)", [name, email, password], (err, result) => {
          if (err) {
            console.log(err)
          } else {
            res.send({ "result": "Done" });
          }
        })
      }
    }
  })
})

app.listen(PORT, () => {
  console.log('server is running on http://localhost:' + PORT);
})