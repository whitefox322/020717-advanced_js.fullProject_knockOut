import express from "express";
import nodeStatic from "node-static";
import bodyParser from "body-parser";
import UsersController from "./backend/controller/Users.controller";
import ArticlesController from "./backend/controller/Articles.controller";
import readJsonSync from "./backend/database/FsDataProvider";

const
	file = new nodeStatic.Server("."),
	app = express(),
	USERS_PATH = __dirname + "/resources/users.json",
	ARTICLES_PATH = __dirname + "/resources/articles.json",
	LISTEN_PORT = 8081;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = readJsonSync(USERS_PATH);
const usersController = new UsersController(users);
usersController.bind(app);

const articles = readJsonSync(ARTICLES_PATH);
const articlesController = new ArticlesController(articles, usersController.dataSet);
articlesController.bind(app);

app.get("*", function (req, res) {
	file.serve(req, res);
});

app.listen(LISTEN_PORT);
console.log("Listen port " + LISTEN_PORT);

function useController(Controller, dataPath) {
	const data = readJsonSync(dataPath);
	const controller = new Controller(data);
	controller.bind(app);
}