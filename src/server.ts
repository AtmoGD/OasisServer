import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

export namespace Oasis {
    let port: number | string | undefined = process.env.PORT;
    let databaseURL: string = "mongodb://localhost:27017";

    let command: string = "";

    startServer(port);
    connectToDatabase(databaseURL);

    function startServer(_port: number | string | undefined): void {
        if (port == undefined)
            port = 5001;

        let server: Http.Server = Http.createServer();
        server.listen(port);
        console.log("listening on :" + port);

        server.addListener("request", handleRequest);
    }

    async function connectToDatabase(_url: string): Promise<void> {
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url);
        await mongoClient.connect();
        console.log("Database connection is established");

        let orders: Mongo.Collection = mongoClient.db("Oasis").collection("Commands");
        orders.insertOne({"ghost": "UP"});
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        console.log("Here");
        if (_request.url) {

            console.log(_request.url);
            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

            let newCommand = url.query["command"]?.toString()!;
            if (newCommand == undefined)
                newCommand = "";

            if (newCommand == "getCommand") {
                _response.write("Command is: " + command);
            } else {
                command = newCommand;
                _response.write("Command received: " + command);
            }
        }

        _response.end();
    }
}