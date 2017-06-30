import UsersList from "../models/UsersList.model";
import ControllerBase from "./Controller.base";

export default class UsersController extends ControllerBase {
	constructor(users) {
		super(new UsersList(users));
	}

	pagedPreview(req, res) {
		const paged = this.dataSet.pagedSnapshots(req.params.page, req.params.limit);
		if (paged.page > paged.totalPages) {
			return res.status(404).end();
		}

		return res.send(paged);
	}

	bind(app) {
		const countries = [];
		const rawDatabase = this.dataSet.rawDatabase;
		for (let i = 0; i < rawDatabase.length; i++) {
			if (countries.indexOf(rawDatabase[i].country) === -1) {
				countries.push(rawDatabase[i].country);
			}
		}

		app.get("/api/users/:id", this.get.bind(this));
		app.get("/api/users/:page/:limit", this.paged.bind(this));
		app.get("/api/users/:page/:limit/preview", this.pagedPreview.bind(this));

		app.post("/api/users", this.add.bind(this));
		app.put("/api/users", this.update.bind(this));
		app.delete("/api/users/:id", this.del.bind(this));

		app.get("/api/countries", function (req, res) {
			res.send(countries);
		});
	}
}