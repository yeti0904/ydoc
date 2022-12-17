const express  = require("express");
const showdown = require("showdown");
const ejs      = require("ejs");
const fs       = require("fs");
const app      = express();

let config  = require("./config.json");
let sidebar = require("./sidebar.json")

let converter = new showdown.Converter();

app.set("views", "./pages");
app.set("view engine", "ejs");

app.get("/favicon.ico", (req, res) => {
	res.sendStatus(404);
});

app.get("*", (req, res) => {
	let path = req.originalUrl == "/"? "./docs/index.md" : `./docs/${req.originalUrl}.md`;

	if (!fs.existsSync(path)) {
		if (path == "./docs/index.md") {
			fs.writeFileSync(path, "# Welcome to your documentation\n\nChange this page in docs/index.md");
		}
		else {
			res.sendStatus(404);
			return;
		}
	}

	res.render("documentation", {
		pageName: req.baseUrl,
		websiteName: config.websiteName,
		contents: converter.makeHtml(fs.readFileSync(path, {encoding: "utf8", flag: "r"})),
		sidebar: sidebar
	});
});

app.listen(config.port, () => {
	console.log(`ydoc listening on port ${config.port}`);
});