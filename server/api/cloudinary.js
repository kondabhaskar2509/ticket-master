import express from "express"
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import multerStorageCloudinary from "multer-storage-cloudinary";
const { CloudinaryStorage } = multerStorageCloudinary;


function setupCloudinary(app) {

cloudinary.config({
  cloud_name: "diucqhtuf",
  api_key: "946696221645686",
  api_secret: "UYDTq8NqId-C0eoZSgytPZOGgjU",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "/uploads",
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