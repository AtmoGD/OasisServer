import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

export namespace Oasis {
    let port: number | string | undefined = process.env.PORT;
    let databaseURL: string = "mongodb+srv://Admin:OasisServer@cluster0.ayk2n.mongodb.net/Oasis?retryWrites=true&w=majority";
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(databaseURL);

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

        await mongoClient.connect();
        console.log("Database connection is established");
    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        console.log("Here");
        if (_request.url) {

            console.log(_request.url);
            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

            let newCommand = url.query["ghost"]?.toString()!;
            if (newCommand == undefined)
                newCommand = "";

            let mongo: Mongo.Collection = mongoClient.db("Oasis").collection("Commands");


            if (newCommand == "getCommand") {
                _response.write("Command is: " + await mongo.find( { "ghost" : { $exists : true } }));
            } else {
                await mongo.updateOne({_id: "625025edc8b13bb0fd87915f"}, {$set: {"ghost": newCommand.toString()}}, {upsert: true});

                _response.write("Command received: " + newCommand);
            }
        }

        _response.end();
    }
}