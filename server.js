const express = require("express");
const app = express();
const shortid = require("shortid");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ todos: [] }).write();

// const todos = [
//   { id: 1, name: "Đi chợ" },
//   { id: 2, name: "Nấu cơm" },
//   { id: 3, name: "Rửa bát" },
//   { id: 4, name: "Học code ở CodersX" }
// ];
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.render("index", {
    name: "I love CodersX."
  });
});
app.get("/todos", (request, response) => {
  response.render("todos", {
    todos: db.get("todos").value()
  });
});
app.get("/todos/search", (request, response) => {
  var q = request.query.q;
  var matchedTodos = db
    .get("todos")
    .value()
    .filter(todo => todo.name.toLowerCase().indexOf(q.toLowerCase()) !== -1);
  response.render("todos", {
    todos: matchedTodos,
    question: q
  });
});
app.get("/todos/create", (req, res) => {
  res.render("create");
});
app.get("/todos/:id/delete", (req, res) => {
  var id = req.params.id;
  db.get("todos")
    .remove({ id: id })
    .write();
  res.redirect("/todos");
});

app.post("/todos/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("todos")
    .unshift(req.body)
    .write();
  res.redirect("/todos");
});
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
