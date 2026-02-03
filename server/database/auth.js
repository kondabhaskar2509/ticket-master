import fetch from "node-fetch";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key";

function setupAuth(app, authcollection) {
  let clientid = process.env.MYAUTH_CLIENT_ID;
  let clientsecret = process.env.MYAUTH_CLIENT_SECRET;

  app.post("/signup", async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      const user = await authcollection.findOne({ email });
      if (user) {
        return res.json({ status: "error", error: "User already exists" });
      }
      const result = await authcollection.insertOne({
        name,
        email,
        password,
        confirmPassword,
      });
      const newUser = await authcollection.findOne({ email });
      const token = jwt.sign(
        { id: result.insertedId, email, name },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      const userObj = { name, email };

      res.json({
        status: "success",
        id: result.insertedId,
        token,
        user: userObj,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authcollection.findOne({ email });
      if (!user) {
        return res.json({ status: "error", error: "User not found" });
      }
      if (user.password !== password) {
        return res.json({ status: "error", error: "Invalid password" });
      }

      // Generating JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      const userObj = {
        name: user.name,
        email: user.email,
      };

      res.json({
        status: "success",
        id: user._id,
        token,
        user: userObj,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/profile", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await authcollection.findOne({ email });
      if (user) {
        const userData = {
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        };

        return res.json({
          status: "success",
          user: userData,
        });
      }
    } catch (e) {
      res.status(500).json({ status: "error", error: e.message });
    }
  });

  app.post("/profile-image", async (req, res) => {
    try {
      const { email, imageUrl } = req.body;
      if (!email || !imageUrl) {
        return res.status(400).json({ status: "error", error: "Missing data" });
      }
      await authcollection.updateOne(
        { email },
        { $set: { profileImage: imageUrl } }
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ status: "error", error: e.message });
    }
  });

  app.post("/change-password", async (req, res) => {
    try {
      const { email, currentPassword, newPassword, newConfirmPassword } =
        req.body;

      if (!email || !currentPassword || !newPassword || !newConfirmPassword) {
        return res.json({ status: "error", error: "All fields are required" });
      }

      if (newPassword !== newConfirmPassword) {
        return res.json({
          status: "error",
          error: "New passwords do not match",
        });
      }

      const user = await authcollection.findOne({ email });

      if (!user) {
        return res.json({ status: "error", error: "User not found" });
      }

      if (user.password !== currentPassword) {
        return res.json({
          status: "error",
          error: "Current password is incorrect",
        });
      }

      if (currentPassword === newPassword) {
        return res.json({
          status: "error",
          error: "New password cannot be the same as current password",
        });
      }

      const result = await authcollection.updateOne(
        { email: email },
        { $set: { password: newPassword, confirmPassword: newPassword } }
      );

      if (result.matchedCount === 0) {
        return res.json({
          status: "error",
          error: "Failed to update password",
        });
      }

      return res.json({ status: "success" });
    } catch (e) {
      console.error("Change password error:", e);
      return res.status(500).json({ status: "error", error: "Server error" });
    }
  });

  app.post("/reset-password", async (req, res) => {
    try {
      const { email, newPassword, newConfirmPassword } = req.body;

      if (!email) {
        return res.json({ status: "failure", error: "Email is required" });
      }

      const user = await authcollection.findOne({ email });

      if (!user) {
        return res.json({ status: "failure", error: "User not found" });
      }

      if (newPassword !== newConfirmPassword) {
        return res.json({ status: "failure", error: "Passwords do not match" });
      }

      if (newPassword === user.password) {
        return res.json({
          status: "failure",
          error: "New password cannot be the same as old password",
        });
      }

      const result = await authcollection.updateOne(
        { email: email },
        { $set: { password: newPassword, confirmPassword: newConfirmPassword } }
      );

      if (result.matchedCount === 0) {
        return res.json({
          status: "failure",
          error: "Failed to update password",
        });
      }

      return res.json({ status: "success" });
    } catch (e) {
      console.error("Reset password error:", e);
      return res.status(500).json({ status: "error", error: "Server error" });
    }
  });

  app.post("/forgot-password-usercheck", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await authcollection.findOne({ email });
      if (!user) {
        return res.json({ status: "failure" });
      }
      return res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ status: "error", error: e.message });
    }
  });

  app.post("/verify-token", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(400)
          .json({ status: "error", error: "Authorization token is required" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await authcollection.findOne({ email: decoded.email });

      if (!user) {
        return res
          .status(404)
          .json({ status: "error", error: "User not found" });
      }

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
      };

      return res.json({
        status: "success",
        user: userData,
      });
    } catch (e) {
      console.error("Token verification error:", e);
      return res
        .status(401)
        .json({ status: "error", error: "Invalid or expired token" });
    }
  });

  app.post("/signin", async (req, res) => {
    try {
      // Exchanging code for access token
      const { code } = req.body;
      const tokenRes = await fetch(
        "https://auth.delta.nitt.edu/api/oauth/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.DAUTH_CLIENT_ID,
            client_secret: process.env.DAUTH_CLIENT_SECRET,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.DAUTH_REDIRECT_URI,
          }),
        }
      );
      const tokenData = await tokenRes.json();

      // Fetching user info
      const userRes = await fetch(
        "https://auth.delta.nitt.edu/api/resources/user",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );
      const userData = await userRes.json();

      //adding the data to the mongodb and fetching to the profile
      if (userData.email && userData.name) {
        let user = await authcollection.findOne({ email: userData.email });

        if (!user) {
          await authcollection.insertOne({
            name: userData.name,
            email: userData.email,
          });
          user = await authcollection.findOne({ email: userData.email });
        }

        // Generating JWT token for DAuth login
        const token = jwt.sign(
          { id: user._id, email: user.email, name: user.name },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        const userObj = {
          name: user.name,
          email: user.email,
        };

        res.json({
          status: "success",
          user: userObj,
          token: token,
        });
      } else {
        res
          .status(400)
          .json({ status: "error", error: "Invalid user data from DAuth" });
      }
    } catch (e) {
      res.status(500).json({ status: "error", error: e.message });
    }
  });

  app.post("/myauthsignin", async (req, res) => {
    try {
      const { code } = req.body;

      // Exchanging code for access token
      const tokenRes = await fetch("http://localhost:3000/getaccesstoken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientid: process.env.MYAUTH_CLIENT_ID,
          clientsecret: process.env.MYAUTH_CLIENT_SECRET,
          code: code,
        }),
      });
      const tokenData = await tokenRes.json();

      if (!tokenData.accesstoken) {
        return res.status(400).json({
          status: "error",
          error: "No access token returned",
          details: tokenData,
        });
      }

      // Fetch user info, send access token in body instead of header
      const userRes = await fetch("http://localhost:3000/getuserdetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accesstoken: tokenData.accesstoken }),
      });
      const userData = await userRes.json();

      //adding the data to the mongodb and fetching to the profile
      if (userData.email && userData.name) {
        let user = await authcollection.findOne({ email: userData.email });

        if (!user) {
          await authcollection.insertOne({
            name: userData.name,
            email: userData.email,
          });
          user = await authcollection.findOne({ email: userData.email });
        }

        // Generating JWT token for My Auth login
        const token = jwt.sign(
          { id: user._id, email: user.email, name: user.name },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        const userObj = {
          name: user.name,
          email: user.email,
        };

        res.json({
          status: "success",
          user: userObj,
          token: token,
        });
      } else {
        res.status(400).json({
          status: "error",
          error: "Invalid user data from My Auth",
          details: userData,
        });
      }
    } catch (e) {
      console.error("Error in /myauthsignin:", e);
      res.status(500).json({ status: "error", error: e.message });
    }
  });
}

export default setupAuth;
