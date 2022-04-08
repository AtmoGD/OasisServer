"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oasis = void 0;
const Http = require("http");
const Url = require("url");
var Oasis;
(function (Oasis) {
    let port = process.env.port;
    let command = process.env.command;
    if (port == undefined)
        port = 5001;
    startServer(port);
    function startServer(_port) {
        let server = Http.createServer();
        server.listen(port);
        console.log("listening on :");
        server.addListener("request", handleRequest);
    }
    function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        console.log("Here");
        if (_request.url) {
            console.log(_request.url);
            let url = Url.parse(_request.url, true);
            for (let key in url.query) {
                _response.write(key + ":" + url.query[key] + "<br/>");
            }
            command = url.query["command"];
            let jsonString = JSON.stringify(url.query);
            _response.write(jsonString + command);
        }
        _response.end();
    }
})(Oasis = exports.Oasis || (exports.Oasis = {}));
//# sourceMappingURL=Server.js.map