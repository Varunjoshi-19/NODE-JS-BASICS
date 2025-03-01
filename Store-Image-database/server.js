const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const UploadDoc = require("./uploadSchema.js");

const uploadPath = path.resolve(__dirname, "upload");

// Change to memory storage for saving buffer to MongoDB
const storage = multer.memoryStorage();  // Now using memory storage
const upload = multer({ storage: storage });

const app = express();

app.set("view-engine", "ejs");

app.use(express.static(path.resolve(__dirname, "views")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/upload", upload.single("file"), async (req, res) => {
    const { name } = req.body;

    const newUpload = new UploadDoc({
        ImageName: name
    });

    if (req.file) {
        newUpload.actualImage.data = req.file.buffer;  // Store image buffer
        newUpload.actualImage.contentType = req.file.mimetype;  // Store image content type
    }

    try {
        const saveImage = await newUpload.save();
        // Render the EJS template and pass the image ID to the template
        res.render("uploadSuccess.ejs", { imageId: saveImage._id });
    } catch (error) {
        res.render("index.ejs", { error: "Error uploading image" });
    }
});


app.get("/show/:id", async (req, res) => {
    try {
        const image = await UploadDoc.findById(req.params.id);
        if (!image || !image.actualImage || !image.actualImage.data) {
            return res.status(404).send("Image not found");
        }
        res.contentType(image.actualImage.contentType);
        res.send(image.actualImage.data);
    } catch (error) {
        res.status(500).send("Error fetching image");
    }
});


// MongoDB connection and server porting
const url = "mongodb://127.0.0.1:27017/uploadImage";
mongoose.connect(url);
const connection = mongoose.connection;
connection.on("error", (error) => console.log(error));
connection.once("open", () => {
    app.listen(4000, () => {
        console.log("Server running on port 4000 and Mongo connected");
    });
});
