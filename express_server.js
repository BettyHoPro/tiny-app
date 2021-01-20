const express = require("express");
const app = express();
const PORT = 3000; 
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


function generateRandomString(stringInLength) {
  return Math.random().toString(36).replace("0.","").substring(0,6);
};



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, (req) => {
  console.log(`Example app listening on port ${PORT}!`);
});

// new short URL add
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);         
});

// deleting feature
app.post("/urls/:shortURL/delete", (req , res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//刪除加上加新項目的變形金剛... 研究看看then catch 能不能合併寫 要不然就是叫一個新的ＩＤ去跑同一個show頁面 去修改連結網址後 再傳回主頁 
app.post("/urls/:shortURL/", (req, res) => {
   //this params means crab the information from the already show in the web front side
   const shortURL = req.params.shortURL; 
   const longURL = req.body.longURL;
   urlDatabase[shortURL] = longURL;
   //delete urlDatabase[req.params.shortURL];
   //const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
   //res.redirect("urls_index", templateVars);
   res.redirect("/urls");
   //res.redirect("/urls");
   //res.render("/urls_show");
 });

 //app.get("/urls/:shortURL/", (req, res ) => {

 //});
//get routine 

app.get("/urls.json",(req, res) => {
   res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(urlDatabase[req.params.shortURL]);
  //res.redirect(longURL); // ---> not working
});


app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

