import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

export namespace Oasis {
    let port: number | string = process.env.PORT == undefined ? 5001 : process.env.PORT;
    let databaseURL: string = "mongodb+srv://Admin:OasisServer@cluster0.ayk2n.mongodb.net/Oasis?retryWrites=true&w=majority";
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(databaseURL);

    startServer(port);
    connectToDatabase(databaseURL);

    function startServer(_port: number | string | undefined): void {
        let server: Http.Server = Http.createServer();
        server.listen(port);
        server.addListener("request", handleRequest);

        console.log("listening on :" + port);
    }

    async function connectToDatabase(_url: string): Promise<void> {
        await mongoClient.connect();

        console.log("Database connection is established");
    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        if (_request.url) {
            console.log(_request.url);

            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

            let newCommand: string = url.query["ghost"] ? url.query["ghost"].toString() : "";

            let mongo: Mongo.Collection = mongoClient.db("Oasis").collection("Commands");

            if (newCommand == "getCommand") {
                _response.write("Command is: " + await mongo.find({ "ghost": { $exists: true } }));
            } else {
                let filter: Mongo.Filter<any> = { _id: "625025edc8b13bb0fd87915f" };
                let update: Mongo.Document = { ghost: JSON.stringify(newCommand) + "Hello" };
                await mongo.updateOne(filter, {$set: update});
                _response.write("Command received: " + newCommand);
            }

        }
        _response.end();
    }
}