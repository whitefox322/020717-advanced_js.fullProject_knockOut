import express from "express";
import nodeStatic from "node-static";
import bodyParser from "body-parser";
import UsersController from "./backend/controller/Users.controller";
import ArticlesController from "./backend/controller/Articles.controller";
import FsDataProvider from "./backend/database/FsDataProvider";

const
	file = new nodeStatic.Server("."),
	app = express(),
	USERS_PATH = __dirname + "/resources/users.json",
	ARTICLES_PATH = __dirname + "/resources/articles.json",
	LISTEN_PORT = 8081;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

useController(UsersController, USERS_PATH);
useController(ArticlesController, ARTICLES_PATH);

app.get("*", function (req, res) {
	file.serve(req, res);
});

app.listen(LISTEN_PORT);
console.log("Listen port " + LISTEN_PORT);

function useController(Controller, dataPath) {
	const data = FsDataProvider.readJsonSync(dataPath);
	const controller = new Controller(data);
	controller.bind(app);
}