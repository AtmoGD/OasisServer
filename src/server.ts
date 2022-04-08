import * as Http from "http";
import * as Url from "url";

export namespace Oasis {
    let port: number | string | undefined = process.env.PORT;
    if (port == undefined)
        port = 5001;

    let command: string = "";

    startServer(port);

    function startServer(_port: number | string): void {
        let server: Http.Server = Http.createServer();
        server.listen(port);
        console.log("listening on :" + port + " Yoo");
        console.log("Server started");

        server.addListener("request", handleRequest);
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        console.log("Here");
        if (_request.url) {

            console.log(_request.url);
            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

            let newCommand = url.query["command"]?.toString()!;

            if (newCommand == "getCommand") {
                _response.write("Command is: " + command);
            } else {
                command = newCommand == undefined ? "" : newCommand;
                _response.write("Command received: " + command);
            }
        }

        _response.end();
    }
}