const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

const vlogs = [
  { key: "HOME", value: "This is my personal vlogging tool.This is my personal vlogging tool.This is my personal vlogging tool.This is my personal vlogging tool.This is my personal vlogging tool.This is my personal vlogging tool.This is my personal vlogging tool." }
];


app.listen(port, function(){
    console.log("app is up at " + port);
})

app.get("/", function(req, res){
    res.render("home",{title: "home", vlogs: vlogs});
})

app.get("/about", function(req, res){
    res.render("about",{title: "about"});
})

app.get("/contact", function(req, res){
    res.render("contact",{title: "contacts"});
})

app.get("/write", function(req, res){
    res.render("write",{title: 'write'});
})

app.post("/write", function(req, res){
    vlogs.push({key: req.body.title, value: req.body.post});
    dynamicGenerator();
    res.redirect("/");
})


let dynamicGenerator = function(){
for(let i = 0; i < vlogs.length; i++){
    app.get(`/%%`+`${vlogs[i].key.replace(/\s+/g, "*")}`, function(req, res){
        res.render("special", {title: vlogs[i].key, post: vlogs[i].value});
    })
}
};

dynamicGenerator();