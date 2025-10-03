require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.APP_PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/userRoutes");
const billsPaymentRoutes = require("./src/routes/billsPaymentRoutes");
const passport = require('./config/passport');
const oauthRoutes = require('./src/routes/authRoutes');
app.use(bodyParser.json());
app.use(passport.initialize());
require("./src/jobs/requeryJob");
require("./src/utils/cron");


const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use('/auth', oauthRoutes);
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/vtpass", billsPaymentRoutes)




app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

app.use((req, res) => {
  res.status(404).json({
    message: "Page Not Found",
  });
});

