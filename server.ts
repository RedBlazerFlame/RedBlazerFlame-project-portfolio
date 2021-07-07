// Importing Libraries
import express, { Express, Request, Response } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import http from "http";
import { readFile } from "fs";

// Declaring Constants
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_READ_OPTIONS = {
    root: __dirname
};

// Creating Express server
const app: Express = express();
const httpServer: http.Server = http.createServer(app);

// Setting up the Express server
app.get("/", (req: Request, res: Response) => {
    res.sendFile(`root/index.html`, { ...FILE_READ_OPTIONS, "content-type": "text/html" });
})

app.get("/root/:fileType-:fileName", (req: Request, res: Response) => {
    let filePath = `root/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            } else {
                res.json(JSON.parse(data));
            }
        })
    } else {
        res.sendFile(filePath, { ...FILE_READ_OPTIONS, "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` });
    }
})

app.get("/root/:dir1/:fileType-:fileName", (req: Request, res: Response) => {
    let filePath = `root/${req.params.dir1}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            } else {
                res.json(JSON.parse(data));
            }
        })
    } else {
        res.sendFile(filePath, { ...FILE_READ_OPTIONS, "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` });
    }
})

app.get("/root/:dir1/:dir2/:fileType-:fileName", (req: Request, res: Response) => {
    let filePath = `root/${req.params.dir1}/${req.params.dir2}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            } else {
                res.json(JSON.parse(data));
            }
        })
    } else {
        res.sendFile(filePath, { ...FILE_READ_OPTIONS, "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` });
    }
})

app.get("/root/:dir1/:dir2/:dir3/:fileType-:fileName", (req: Request, res: Response) => {
    let filePath = `root/${req.params.dir1}/${req.params.dir2}/${req.params.dir3}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            } else {
                res.json(JSON.parse(data));
            }
        })
    } else {
        res.sendFile(filePath, { ...FILE_READ_OPTIONS, "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` });
    }
})

app.get("/root/:dir1/:dir2/:dir3/:dir4/:fileType-:fileName", (req: Request, res: Response) => {
    let filePath = `root/${req.params.dir1}/${req.params.dir2}/${req.params.dir3}/${req.params.dir4}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            } else {
                res.json(JSON.parse(data));
            }
        })
    } else {
        res.sendFile(filePath, { ...FILE_READ_OPTIONS, "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` });
    }
})
app.get("/root/:dir1/:dir2/:dir3/:dir4/:dir5/:fileType-:fileName", (req: Request, res: Response) => {
    let filePath = `root/${req.params.dir1}/${req.params.dir2}/${req.params.dir3}/${req.params.dir4}/${req.params.dir5}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            } else {
                res.json(JSON.parse(data));
            }
        })
    } else {
        res.sendFile(filePath, { ...FILE_READ_OPTIONS, "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` });
    }
})



// Listening to the Port
httpServer.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})