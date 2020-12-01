import express from "express";
import dotenv from "dotenv";
import http from "http";
import routes from "./routes";
import socketio from "socket.io";

dotenv.config();

const port = process.env.SERVER_PORT;
const app = express();

app.use(routes);

const server = http.createServer(app);
const io = new socketio.Server(server);

let interval: any;

io.on("connection", (socket: any) => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

const getApiAndEmit = (socket: any) => {
    const response = new Date();
    socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));