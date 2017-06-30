import fs from "fs";

export default function readJsonSync(path) {
	const jsonStr = fs.readFileSync(path, "utf8");
	return JSON.parse(jsonStr);
}