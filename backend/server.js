require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const { connectToMongo, mongoose } = require("./config/db");
const memoRoutes = require("./routes/memoRoutes");
const authRoutes = require("./routes/authRoutes");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Add it to backend/.env before starting the server.");
}

const app = express();
const port = process.env.PORT || 3000;
const mongoRetryDelayMs = 5000;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://127.0.0.1:5173",
    credentials: true,
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/memos", memoRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Backend server is running" });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use((error, _req, res, _next) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function connectWithRetry() {
  try {
    await connectToMongo();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`MongoDB connection failed. Retrying in ${mongoRetryDelayMs / 1000} seconds.`);
    console.error(error.message);
    setTimeout(connectWithRetry, mongoRetryDelayMs);
  }
}

connectWithRetry();
