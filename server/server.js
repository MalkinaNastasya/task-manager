const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const dbConfig = require("./db.config.js");
const app = express();

// Парсинг json
app.use(bodyParser.json());

// Парсинг запросов по типу: application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Настройка CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE"
  );
  next();
});

// Создание соединения с базой данных
const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  charset: 'utf8_general_ci',
  connectionLimit: 10
});
connection.getConnection((err, connect) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  } else {
    connect.query('SET NAMES "utf8"');
    connect.query('SET CHARACTER SET "utf8"');
    connect.query('SET SESSION collation_connection = "utf8_general_ci"');
    console.log("Успешно соединено с БД");
  }
  if (connect) connect.release();
});

// Регистрация пользователя
app.post("/api/registration", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для пользователей:');
  console.log(req.body);
  connection.query(`SELECT * FROM users WHERE login='${req.body.login}'`, function (error, results) {
    if (error) {
      res.status(500).send('Ошибка сервера при получении пользователей с таким же логином')
      console.log(error);
    }
    console.log('Результаты проверки существования логина:');
    console.log(results[0]);
    if (results[0] === undefined) {
      connection.query('INSERT INTO `users` (`id_user`, `login`, `password`, `name`, `email`) VALUES (NULL, ?, ?, ?, ?)',
        [req.body.login, req.body.password, req.body.name, req.body.email],
        function () {
          console.log('Запрос на проверку существования созданной записи в БД');
          connection.query(`SELECT * FROM users WHERE login="${req.body.login}"`,
            function (err, result) {
              if (err) {
                res.status(500).send('Ошибка сервера при получении пользователя по логину')
                console.log(err);
              } else {
                console.log(result);
                res.json(result);
              }
            });
        })
    } else {
      res.json("exist");
    }
  });
})

//Обработка входа 
app.post("/api/login", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для входа:');
  console.log(req.body);
  connection.query(`SELECT * FROM users WHERE (login="${req.body.login}") AND (password="${req.body.password}")`,
    function (err, results) {
      if (err) {
        res.status(500).send('Ошибка сервера при получении пользователя по логину')
        console.log(err);
      }
      console.log('Результаты проверки существования пользователя:');
      if (results !== undefined) {
        if (results[0] === undefined) {
          res.json("not exist");
        } else {
          res.json(results);
        }
      }
    });
})

// Получение всех карточек
app.get('/api/tasks', function (req, res) {
  try {
    connection.query("SELECT * FROM `tasks`", function (error, results) {
      if (error) {
        res.status(500).send('Ошибка сервера при получении карточек')
        console.log(error);
      }
      console.log('Результаты получения карточек');
      console.log(results);
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
});

// Обработка создания карточки
app.post("/api/add", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Сейчас пришёл POST запрос для создания:');
  console.log(req.body);
  connection.query(`INSERT INTO tasks (id_task, id_user, title, body, time, status) 
  VALUES (NULL, ?, ?, ?, ?, ?);`,
  [req.body.id_user, req.body.title, req.body.body, req.body.time, req.body.status],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при cоздании')
        console.log(err);
      }
      console.log('Создание прошло успешно');
      res.json("create");
    });
})

// Обработка удаления карточки 
app.delete("/api/delete/:id_task", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл DELETE запрос для удаления карточки:');
  console.log(req.body);
  connection.query(`DELETE FROM tasks WHERE id_task=${req.params.id_task}`,
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при удалении карточки по id')
        console.log(err);
      }
      console.log('Удаление прошло успешно');
      res.json("delete");
    });
})

// Измененение статуса
app.put("/api/changeStatus/:id_task", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл PUT запрос для изменения статуса:');
  console.log(req.body);
  connection.query(`UPDATE tasks SET status=? WHERE id_task=?`,
    [req.body.status, req.params.id_task],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при запросе для изменения статуса')
        console.log(err);
      }
      console.log('Изменение прошло успешно');
      res.json("create");
    });
})

// Получение одной карточки
app.post("/api/oneTask", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл POST запрос для загрузки страницы карточки:');
  console.log(req.body);
  connection.query('SELECT * FROM tasks WHERE id_task=?;',
  [req.body.id],
    function (err, results) {
      if (err) {
        res.status(500).send('Ошибка сервера при поиске карточки по id ')
        console.log(err);
      }
      console.log('Карточка найдена успешно');
      console.log('Результаты:');
      console.log(results);
      res.json(results);
    });
})

// Измененение данных в карточке
app.put("/api/tasks/:id_task", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('Пришёл PUT запрос для изменения карточки:');
  console.log(req.body);
  connection.query(`UPDATE tasks SET title=?, body=?, status=? WHERE id_task=?`,
    [req.body.title,req.body.body,req.body.status, req.params.id_task],
    function (err) {
      if (err) {
        res.status(500).send('Ошибка сервера при запросе для изменения карточки')
        console.log(err);
      }
      console.log('Изменение прошло успешно');
      res.json("create");
    });
})

// Информирование о запуске сервера и его порте
app.listen(3001, () => {
  console.log("Сервер запущен на http://localhost:3001");
});