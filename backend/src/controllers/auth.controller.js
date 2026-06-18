import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const { user, token } = await authService.registerUser({ name, email, password });
    res.status(201).json({ user, token });
  } catch (error) {
    if (error.message === "Email already in use") {
      return res.status(409).json({ error: error.message });
    }
    console.error("Register Error:", error);
    if (error.code?.startsWith("P")) {
      return res.status(503).json({ error: "Database unavailable. Check server configuration." });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { user, token } = await authService.loginUser({ email, password });
    res.status(200).json({ user, token });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ error: error.message });
    }
    console.error("Login Error:", error);
    if (error.code?.startsWith("P")) {
      return res.status(503).json({ error: "Database unavailable. Check server configuration." });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await authService.getUserById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
