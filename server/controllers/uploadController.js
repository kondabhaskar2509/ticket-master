import multer from "multer";
import cloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

// Configure Cloudinary with env variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Setup Multer with Cloudinary storage
const storage = cloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "ticket-master-uploads",
    allowed_formats: ["jpg", "png"],
  },
});

export const upload = multer({ storage });

// Upload image to Cloudinary
export const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        error: "No file uploaded",
      });
    }

    console.log("File uploaded to Cloudinary:", req.file.path);

    res.json({
      status: "success",
      imageUrl: req.file.path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to upload image",
    });
  }
};
