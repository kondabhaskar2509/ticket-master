import { Router } from "express";
import * as emailController from "../controllers/emailController.js";

export const setupEmailRoutes = (router) => {
  router.post("/send-mail", (req, res) =>
    emailController.sendMailController(req, res)
  );

  return router;
};
