import express from "express"
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import cloudinaryStorage from "multer-storage-cloudinary";



function setupCloudinary(app) {

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png"],
  },
});

const upload = multer({ storage });

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
app.use(express.static(_dirname));

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  if (!req.file) return res.status(400).json({ error: "no file uploaded" });
  res.json({ imageUrl: req.file.path });
});

}

export default setupCloudinary;
