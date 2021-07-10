var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Importing Libraries
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import http from "http";
import { readFile } from "fs";
import cors from "cors";
import { generateNewAnimeCharacter } from "./scripts/generateAnimeCharacter.js";
// Declaring Constants
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_READ_OPTIONS = {
    root: __dirname
};
// Creating Express server
const app = express();
const httpServer = http.createServer(app);
// Setting up the Express server
app.use(cors({ origin: 'http://127.0.0.1:8000' }));
app.get("/", (req, res) => {
    res.sendFile(`root/index.html`, Object.assign(Object.assign({}, FILE_READ_OPTIONS), { "content-type": "text/html" }));
});
app.get("/api/animeFaceGenerator", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield generateNewAnimeCharacter());
    console.log("Anime Character Generated");
}));
app.get("/root/:fileType-:fileName", (req, res) => {
    let filePath = `root/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            }
            else {
                res.json(JSON.parse(data));
            }
        });
    }
    else {
        res.sendFile(filePath, Object.assign(Object.assign({}, FILE_READ_OPTIONS), { "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` }));
    }
});
app.get("/root/:dir1/:fileType-:fileName", (req, res) => {
    let filePath = `root/${req.params.dir1}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            }
            else {
                res.json(JSON.parse(data));
            }
        });
    }
    else {
        res.sendFile(filePath, Object.assign(Object.assign({}, FILE_READ_OPTIONS), { "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` }));
    }
});
app.get("/root/:dir1/:dir2/:fileType-:fileName", (req, res) => {
    let filePath = `root/${req.params.dir1}/${req.params.dir2}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            }
            else {
                res.json(JSON.parse(data));
            }
        });
    }
    else {
        res.sendFile(filePath, Object.assign(Object.assign({}, FILE_READ_OPTIONS), { "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` }));
    }
});
app.get("/root/:dir1/:dir2/:dir3/:fileType-:fileName", (req, res) => {
    let filePath = `root/${req.params.dir1}/${req.params.dir2}/${req.params.dir3}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            }
            else {
                res.json(JSON.parse(data));
            }
        });
    }
    else {
        res.sendFile(filePath, Object.assign(Object.assign({}, FILE_READ_OPTIONS), { "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` }));
    }
});
app.get("/root/:dir1/:dir2/:dir3/:dir4/:fileType-:fileName", (req, res) => {
    let filePath = `root/${req.params.dir1}/${req.params.dir2}/${req.params.dir3}/${req.params.dir4}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            }
            else {
                res.json(JSON.parse(data));
            }
        });
    }
    else {
        res.sendFile(filePath, Object.assign(Object.assign({}, FILE_READ_OPTIONS), { "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` }));
    }
});
app.get("/root/:dir1/:dir2/:dir3/:dir4/:dir5/:fileType-:fileName", (req, res) => {
    let filePath = `root/${req.params.dir1}/${req.params.dir2}/${req.params.dir3}/${req.params.dir4}/${req.params.dir5}/${req.params.fileName}`;
    if (req.params.fileName.split(".").reverse()[0] === "json") {
        readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(403).send(err);
            }
            else {
                res.json(JSON.parse(data));
            }
        });
    }
    else {
        res.sendFile(filePath, Object.assign(Object.assign({}, FILE_READ_OPTIONS), { "content-type": `${req.params.fileType}/${req.params.fileName.split(".").reverse()[0]}` }));
    }
});
// Listening to the Port
httpServer.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
