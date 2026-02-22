import { Router } from "express";
import { verifyJWT } from "../middleware.js";
import * as authController from "../controllers/authController.js";

export const setupAuthRoutes = (router, authCollection) => {
  // Public routes
  router.post("/signup", (req, res) =>
    authController.signupController(req, res, authCollection)
  );

  router.post("/login", (req, res) =>
    authController.loginController(req, res, authCollection)
  );

  router.post("/profile", (req, res) =>
    authController.getProfileController(req, res, authCollection)
  );

  router.post("/forgot-password-usercheck", (req, res) =>
    authController.forgotPasswordCheckController(req, res, authCollection)
  );

  router.post("/verify-token", (req, res) =>
    authController.verifyTokenController(req, res, authCollection)
  );

  router.post("/signin", (req, res) =>
    authController.dAuthSigninController(req, res, authCollection)
  );

  router.post("/myauthsignin", (req, res) =>
    authController.myAuthSigninController(req, res, authCollection)
  );

  // Protected routes
  router.post("/change-password", verifyJWT, (req, res) =>
    authController.changePasswordController(req, res, authCollection)
  );

  router.post("/reset-password", (req, res) =>
    authController.resetPasswordController(req, res, authCollection)
  );

  router.post("/profile-image", verifyJWT, (req, res) =>
    authController.updateProfileImageController(req, res, authCollection)
  );

  return router;
};
