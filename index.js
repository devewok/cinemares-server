const fs = require('fs');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
	socket.on('moviechat', message => {
		socket.broadcast.emit("moviechat", message)
	})
});


app.use(cors())
app.get("/video", (req, res) => {
	const range = req.headers.range;
	if (!range) {
		res.status(400).send("Require Range Header");
		return
	}

	const videoPath = './resources/example.mp4';
	const videoSize = fs.statSync(videoPath).size;

	const CHUNK_SIZE = 10 ** 6 // 10 power of 6 is 1MB
	const start = Number(range.replace(/\D/g, ""));// replace all non-digit characters to empty string and parse into Number

	const end = Math.min(videoSize - 1, start + CHUNK_SIZE);
	const contentLength = end - start + 1;
	const header = {
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Range": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};
	res.writeHead(206, header)
	const readStream = fs.createReadStream(videoPath, { start, end });
	readStream.pipe(res)
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => { console.log(`Server is Running at PORT ${PORT}`) });
