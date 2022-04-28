require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
app.set("view engine", "ejs");
// middlewares
app.use(express.static("public"));
app.use(cookieParser("secret"));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

mongoose
  .connect("mongodb://localhost:27017/test", {
    //useFindAndModify: false, 在新版已被預設
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

/*
const monkeySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
  },
});

const Monkey = mongoose.model("Monkey", monkeySchema);

//validator error has to be caught by .catch()
app.get("/", async (req, res, next) => {
  try {
    await Monkey.findOneAndUpdate(
      { name: "pengpeng" },
      { name: "peng" },
      { new: true, runValidators: true },
      (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

/*
//async error use try and catch
app.get("/", async (req, res, next) => {
  try {
    let foundData = await Monkey.findOne({ name: "pengpeng" });
    res.send(foundData);
  } catch (err) {
    next(err);
  }
});


app.get("/", (req, res) => {
  let newMonkey = new Monkey({ name: "pengpeng" });
  newMonkey
    .save()
    .then(() => {
      res.send("data has been saved");
    })
    .catch((e) => {
      console.log(e);
    });
});
*/
/*
app.get("/", (req, res) => {
  //res.cookie("name", "pengpeng");
  let { name } = req.cookies;
  let { address } = req.signedCookies;
  res.send(name + "  welcome to homepage  " + address + "  is my country");
});
*/
/*
app.get("/getSignCookies", (req, res) => {
  res.cookie("address", "taiwan", { signed: true });
  res.send("cookie has been signed");
});
*/

app.get("/", (req, res) => {
  req.flash("success", "success for login");
  console.log(req.session);
  console.log(process.env.SECRET_KEY);
  res.send("welcome to homepage  " + req.flash("success"));
});

app.get("/verifyUser", (req, res) => {
  req.session.isVerified = true;
  res.send("you ara verifyUser");
});

app.get("/secret", (req, res) => {
  if (req.session.isVerified == true) {
    res.send("this is my secret");
  } else {
    res.status(403).send("you are not allowed");
  }
});

app.get("/*", (req, res) => {
  res.status(404).send("404 Not Found");
});

//error handleler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("something is broken ,we will fix it soon");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
