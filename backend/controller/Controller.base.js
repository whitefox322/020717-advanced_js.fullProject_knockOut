export default class ControllerBase {
	constructor(dataSet) {
		this.dataSet = dataSet;
	}

	add(req, res) {
		let item = req.body;
		if (!item) {
			return res.status(400)
				.send({
					message: "Please check arguments you sent to server. Request body is empty!"
				});
		}

		const errorMessage = this.beforeAdd(item);
		if (errorMessage) {
			return res.status(400)
				.send({
					message: errorMessage
				});
		}

		item = this.dataSet.add(item);
		return res.send(item);
	}

	beforeAdd() {}
	beforeUpdate() {}
	beforeGet() {}
	beforeDelete() {}
	beforePaged() {}

	filterPaged(paged) {
		return paged;
	}

	update(req, res) {
		let updatedItem = req.body || {};

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
		const errorMessage = this.beforeUpdate(response);
		if (errorMessage) {
			return res.status(400)
				.send({
					message: errorMessage
				});
		}

		return res.status(status)
			.send(response);
	}

	get(req, res) {
		const id = req.params.id,
			data = this.dataSet.get(id);


		const errorMessage = this.beforeGet(data, req);
		if (errorMessage) {
			return res.status(400)
				.send({
					message: errorMessage
				});
		}

		res.status(data ? 200 : 404)
			.send(data);
	}

	paged(req, res) {
		let paged = this.dataSet.paged(req.params.page, req.params.limit);
		if (paged.page > paged.totalPages) {
			return res.status(404).end();
		}

		const errorMessage = this.beforePaged(paged, req);
		if (errorMessage) {
			return res.status(400)
				.send({
					message: errorMessage
				});
		}

		paged = this.filterPaged(paged);

		return res.send(paged);
	}

	del(req, res) {
		const id = req.params.id;
		const u = this.dataSet.get(id);
		const errorMessage = this.beforeDelete(u, req);
		if (errorMessage) {
			return res.status(400)
				.send({
					message: errorMessage
				});
		}

		if (!u) {
			return res.status(400)
				.end();
		}

		this.dataSet.remove(id);
		res.send(u);
	}

	bind(app) {
		throw new Error("Not implemented!");
	}
}