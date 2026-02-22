import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRY = "24h";

const getPasswordResetEmail = (email) => {
  const resetLink = `${process.env.FRONTEND}/reset-password?email=${email}`;
  return {
    subject: "Reset your password - Ticket Master",
    html: `<html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #36a3eb;">Password Reset Request</h2>
          <p>We received a request to reset your password for your Ticket Master account.</p>
          <p>If you did not make this request, you can safely ignore this email.</p>
          <p>To reset your password, please click the link below:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #36a3eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">This link will expire in 24 hours.</p>
        </div>
      </body>
    </html>`,
  };
};

export const signupController = async (req, res, authCollection) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ status: "error", error: "All fields are required" });
    }

    const user = await authCollection.findOne({ email });
    if (user) {
      return res.json({ status: "error", error: "User already exists" });
    }

    const result = await authCollection.insertOne({
      name,
      email,
      password,
      confirmPassword,
      profileImage: null,
      createdAt: new Date(),
    });

    const token = jwt.sign({ id: result.insertedId, email, name }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    const userObj = { name, email };

    res.json({
      status: "success",
      id: result.insertedId,
      token,
      user: userObj,
    });
  } catch (e) {
    console.error("Signup error:", e);
    res.status(500).json({ status: "error", error: e.message });
  }
};

export const loginController = async (req, res, authCollection) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", error: "Email and password are required" });
    }

    const user = await authCollection.findOne({ email });
    if (!user) {
      return res.json({ status: "error", error: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ status: "error", error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
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
    console.error("Login error:", e);
    res.status(500).json({ status: "error", error: e.message });
  }
};

export const getProfileController = async (req, res, authCollection) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        error: "Email is required",
      });
    }

    const user = await authCollection.findOne({ email });
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

    return res.status(404).json({
      status: "error",
      error: "User not found",
    });
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
};

export const updateProfileImageController = async (
  req,
  res,
  authCollection
) => {
  try {
    const { email, imageUrl } = req.body;

    if (!email || !imageUrl) {
      return res
        .status(400)
        .json({ status: "error", error: "Email and imageUrl are required" });
    }

    await authCollection.updateOne(
      { email },
      { $set: { profileImage: imageUrl } }
    );

    res.json({ status: "success" });
  } catch (e) {
    console.error("Profile image update error:", e);
    res.status(500).json({ status: "error", error: e.message });
  }
};

export const changePasswordController = async (req, res, authCollection) => {
  try {
    const { email, currentPassword, newPassword, newConfirmPassword } =
      req.body;

    if (!email || !currentPassword || !newPassword || !newConfirmPassword) {
      return res.json({
        status: "error",
        error: "All fields are required",
      });
    }

    if (newPassword !== newConfirmPassword) {
      return res.json({
        status: "error",
        error: "New passwords do not match",
      });
    }

    const user = await authCollection.findOne({ email });

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

    const result = await authCollection.updateOne(
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
    return res.status(500).json({
      status: "error",
      error: "Server error",
    });
  }
};

export const resetPasswordController = async (req, res, authCollection) => {
  try {
    const { email, newPassword, newConfirmPassword } = req.body;

    if (!email || !newPassword || !newConfirmPassword) {
      return res.json({
        status: "failure",
        error: "All fields are required",
      });
    }

    if (newPassword !== newConfirmPassword) {
      return res.json({
        status: "failure",
        error: "Passwords do not match",
      });
    }

    const result = await authCollection.updateOne(
      { email: email },
      { $set: { password: newPassword, confirmPassword: newPassword } }
    );

    if (result.matchedCount === 0) {
      return res.json({
        status: "failure",
        error: "Failed to reset password",
      });
    }

    return res.json({ status: "success" });
  } catch (e) {
    console.error("Reset password error:", e);
    return res.status(500).json({
      status: "error",
      error: "Server error",
    });
  }
};

export const forgotPasswordCheckController = async (
  req,
  res,
  authCollection
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        status: "failure",
        error: "Email is required",
      });
    }

    const user = await authCollection.findOne({ email });
    if (!user) {
      return res.json({ status: "failure" });
    }

    // Send password reset email
    try {
      const emailTemplate = getPasswordResetEmail(email);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending reset email:", emailError);
      // Continue even if email fails
    }

    return res.json({ status: "success" });
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
};

export const verifyTokenController = async (req, res, authCollection) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        status: "error",
        error: "Authorization token is required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await authCollection.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        error: "User not found",
      });
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
    return res.status(401).json({
      status: "error",
      error: "Invalid or expired token",
    });
  }
};

export const dAuthSigninController = async (req, res, authCollection) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        status: "error",
        error: "Authorization code is required",
      });
    }

    // Exchange code for access token
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

    if (!tokenData.access_token) {
      return res.status(400).json({
        status: "error",
        error: "Failed to get access token",
      });
    }

    // Fetch user info
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

    if (userData.email && userData.name) {
      let user = await authCollection.findOne({ email: userData.email });

      if (!user) {
        await authCollection.insertOne({
          name: userData.name,
          email: userData.email,
          profileImage: null,
          createdAt: new Date(),
        });
        user = await authCollection.findOne({ email: userData.email });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
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
        error: "Invalid user data from DAuth",
      });
    }
  } catch (e) {
    console.error("DAuth signin error:", e);
    res.status(500).json({ status: "error", error: e.message });
  }
};

export const myAuthSigninController = async (req, res, authCollection) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        status: "error",
        error: "Authorization code is required",
      });
    }

    // Exchange code for access token
    const tokenRes = await fetch(
      `${process.env.MYAUTH_BASE_URL}/getaccesstoken`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientid: process.env.MYAUTH_CLIENT_ID,
          clientsecret: process.env.MYAUTH_CLIENT_SECRET,
          code: code,
        }),
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.accesstoken) {
      return res.status(400).json({
        status: "error",
        error: "No access token returned",
        details: tokenData,
      });
    }

    // Fetch user info
    const userRes = await fetch(
      `${process.env.MYAUTH_BASE_URL}/getuserdetails`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accesstoken: tokenData.accesstoken }),
      }
    );

    const userData = await userRes.json();

    if (userData.email && userData.name) {
      let user = await authCollection.findOne({ email: userData.email });

      if (!user) {
        await authCollection.insertOne({
          name: userData.name,
          email: userData.email,
          profileImage: null,
          createdAt: new Date(),
        });
        user = await authCollection.findOne({ email: userData.email });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
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
        error: "Invalid user data from MyAuth",
        details: userData,
      });
    }
  } catch (e) {
    console.error("MyAuth signin error:", e);
    res.status(500).json({ status: "error", error: e.message });
  }
};
