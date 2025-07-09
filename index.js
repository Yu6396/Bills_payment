require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.APP_PORT || 3000;
// const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/userRoutes");
// const billsPaymentRoutes = require("./src/routes/billsPaymentRoutes");


const userRoute = require("./src/routes/userRoutes")
app.use(bodyParser.json());



app.use("/api/v1/user", userRoutes)
// app.use("/api/v1/utility-bills", billsPaymentRoutes)




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

