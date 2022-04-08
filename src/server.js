"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oasis = void 0;
const Http = require("http");
const Url = require("url");
var Oasis;
(function (Oasis) {
    let port = process.env.port;
    if (port == undefined)
        port = 5001;
    let command = "";
    startServer(port);
    function startServer(_port) {
        let server = Http.createServer();
        server.listen(port);
        console.log("listening on :" + port + " Yoo");
        console.log("Server started");
        server.addListener("request", handleRequest);
    }
    function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        console.log("Here");
        if (_request.url) {
            console.log(_request.url);
            let url = Url.parse(_request.url, true);
            command = url.query["command"]?.toString();
            let jsonString = JSON.stringify(url.query);
            _response.write(jsonString + "\n" + command);
        }
        _response.end();
    }
})(Oasis = exports.Oasis || (exports.Oasis = {}));
//# sourceMappingURL=server.js.map