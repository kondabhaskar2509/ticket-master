import { Router } from "express";
import {
  upload,
  uploadImageController,
} from "../controllers/uploadController.js";

export const setupUploadRoutes = (router) => {
  router.post("/upload", upload.single("image"), (req, res) =>
    uploadImageController(req, res)
  );

  return router;
};
