const router = require("express").Router()
import authRoutes from "./Auth";

// Object routes
router.use("/auth", authRoutes);

module.exports = router;