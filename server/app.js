require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

//Routers---->
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripe");

//DATABASE CONNECT
const DATABASE_URL = process.env.DATABASE;
mongoose.connect(DATABASE_URL, (err) => {
  if (!err) {
    console.log("DB CONNECT");
  }
});

//Middleware----???
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//My routes----->
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);

//Port
const port = process.env.PORT || 8000;

//Server start
app.listen(port, () => {
  console.log(`SERVER START ON PORT ${port}`);
});
