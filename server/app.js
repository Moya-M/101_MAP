const express = require("express"), 
    databaseConfig = require("./config/databaseConfig"),
    mongoose = require("mongoose"),
    models = require("./models/index")(),
    logger = require("./custom_modules/logger"),
    app = express(),
    server = require("http").Server(app),
    Storage = require("storage"),
    globalStorage = new Storage(),
    io = require("./io")(server, globalStorage),
    env = require("dotenv").config(),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    morgan = require("morgan");

const {clientPath, serverPort} = require("./config/globalConfig");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + clientPath));
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});
mongoose.connect(databaseConfig.db).then(() => {}, (err) => {
    logger.add_log({
        type: "Error", 
        description: "DB error", 
        additionnal_infos: {
            Error :err
        }
    });
});
const db = mongoose.connection;
db.on("error", (err) => {
    logger.add_log({
        type: "Error", 
        description: "DB error", 
        additionnal_infos: {
            Error :err
        }
    });
});
db.once("open", () => {
    logger.add_log({
        type: "General", 
        description: "Succesfully Connected to database"
    });
    server.listen(serverPort, function () {
        logger.add_log({type: "General", 
            description: "Succesfully launched server", 
            additionnal_infos: {
                Port: serverPort
            }
        });
    });
});

