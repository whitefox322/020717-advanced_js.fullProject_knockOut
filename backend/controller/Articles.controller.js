import ArticlesList from "../models/ArticlesList.model";
import ControllerBase from "./Controller.base";

export default class ArticlesController extends ControllerBase {
	constructor(articles, usersDataSet) {
		super(new ArticlesList(articles, usersDataSet));
	}

	add(req, res) {
		let item = req.body;
		if (!item || !req.params.authorID) {
			return res.status(400)
				.send({
					message: "Please check arguments you sent to server. Request body is empty!"
				});
		}

		item.authorID = req.params.authorID;

		item = this.dataSet.add(item);
		return res.send(item);
	}

	update(req, res) {
		let updatedItem = req.body || {};

		if (updatedItem.authorID !== req.params.authorID) {
			return res.status(400)
				.send({
					message: "Article authorID is not same as in route param!"
				});
		}

		let status = 200,
			response;
		try {
			response = this.dataSet.update(updatedItem);
		} catch(e) {
			status = 400;
			response = {
				message: e.message
			};
		}

		return res.status(status)
			.send(response);
	}

	get(req, res) {
		const id = req.params.id,
			authorID = req.params.authorID,
			data = this.dataSet.get(id, authorID);

		res.status(data ? 200 : 404)
			.send(data);
	}

	paged(req, res) {
		let paged = this.dataSet.paged(req.params.page, req.params.limit, req.params.authorID);
		if (paged.page > paged.totalPages) {
			return res.status(404).end();
		}

		return res.send(paged);
	}

	unfilteredPaged(req, res) {
		let paged = this.dataSet.unfilteredPaged(req.params.page, req.params.limit);
		if (paged.page > paged.totalPages) {
			return res.status(404).end();
		}

		return res.send(paged);
	}

	del(req, res) {
		const id = req.params.id;
		const authorID = req.params.authorID;
		const u = this.dataSet.get(id, authorID);

		if (!u) {
			return res.status(400)
				.end();
		}

		this.dataSet.remove(id, authorID);
		res.send(u);
	}

	bind(app) {
		app.get("/api/articles/:page/:limit", this.unfilteredPaged.bind(this));

		app.get("/api/users/:authorID/articles/:id", this.get.bind(this));
		app.get("/api/users/:authorID/articles/:page/:limit", this.paged.bind(this));

		app.post("/api/users/:authorID/articles", this.add.bind(this));
		app.put("/api/users/:authorID/articles", this.update.bind(this));
		app.delete("/api/users/:authorID/articles/:id", this.del.bind(this));
	}
}