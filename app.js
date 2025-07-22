const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Schema and model
const vlogSchema = new mongoose.Schema({
  key: String,
  value: String
});
const Vlog = mongoose.model('vlogs', vlogSchema);

let vlogs = [];

// Connect once
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected!");

    // Fetch vlogs and generate routes
    vlogs = await Vlog.find({});
    generateDynamicRoutes();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Dynamic route generator
let generateDynamicRoutes = function(){
for(let i = 0; i < vlogs.length; i++){
    app.get(`/${vlogs[i].key.replace(/\s+/g, "-")}`, function(req, res){
        res.render("special", {title: vlogs[i].key, post: vlogs[i].value});
    })
}
};

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "home", vlogs: vlogs });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "about" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "contacts" });
});

app.get("/write", (req, res) => {
  res.render("write", { title: "write" });
});

app.post("/write", async (req, res) => {
  await Vlog.insertOne({ key: req.body.title, value: req.body.post });
  vlogs = await Vlog.find({}); // Refresh local vlogs
  generateDynamicRoutes();     // Re-create dynamic routes
  res.redirect("/");
});

app.listen(port, () => {
  console.log("App is running on port " + port);
});
