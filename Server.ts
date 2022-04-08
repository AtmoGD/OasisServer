import * as Http from "http";
import * as Url from "url";

export namespace Oasis {
  let port: number | string | undefined = process.env.port;
  let command: string | string[] | undefined = process.env.command;

  if (port == undefined)
    port = 5001;

  startServer(port);

  function startServer(_port: number | string): void {
    let server: Http.Server = Http.createServer();
    server.listen(port);
    console.log("listening on :");
    server.addListener("request", handleRequest);
  }

  function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");

    console.log("Here");
    if (_request.url) {
      console.log(_request.url);
      let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
      for (let key in url.query) {
        _response.write(key + ":" + url.query[key] + "<br/>");
      }
      command = url.query["command"];

      let jsonString: string = JSON.stringify(url.query);
      _response.write(jsonString);
    }

    _response.end();
  }
}