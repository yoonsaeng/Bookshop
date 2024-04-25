// express 모듈
const express = require("express");
const app = express();

// dotenv 모듈
const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT);

const bookRouter = require("./routes/books");
const cartRouter = require("./routes/carts");
const categoryRouter = require("./routes/category");
const likeRouter = require("./routes/likes");
const orderRouter = require("./routes/orders");
const userRouter = require("./routes/users");

app.use("/books", bookRouter);
app.use("/carts", cartRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
