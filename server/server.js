const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/db");
const { SERVER_PORT, SERVER_URL } = require("./config/serverConfig");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const campaignRouter = require("./routes/campaignRoutes");
const authRouter = require("./routes/authRoutes");
const feedbackRouter = require("./routes/feedbackRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");
const { job } = require("./jobs/cron");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

job.start();

app.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    error: false,
    message: "Server is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/campaign", campaignRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_URL}`)
);
