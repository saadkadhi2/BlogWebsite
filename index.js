import express from "express";
import bodyParser from "body-parser";
import multer from 'multer';
import path from "path";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
let post = [];

app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", upload.single("uploadfile"), (req, res) => {
    const imagePath = req.file ? "images/" + req.file.filename : "";
    post.push(new Post(imagePath, req.body["title"], req.body["body"]));
    res.render("index.ejs", {
        post: post,
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

class Post {
    constructor(image, title, body) {
        this.image = image;
        this.title = title;
        this.body = body;
    }
}