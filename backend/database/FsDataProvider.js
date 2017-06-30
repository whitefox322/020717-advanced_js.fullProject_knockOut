const fs = require("fs");

function readJsonSync(path) {
	const jsonStr = fs.readFileSync(path, "utf8");
	return JSON.parse(jsonStr);
}

exports.readJsonSync = readJsonSync;