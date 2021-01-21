const express = require("express");
const app = express();
const PORT = 3000; 
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userDatabase ={
  "Betty": "Test", 
};

function generateRandomString(stringInLength) {
  return Math.random().toString(36).replace("0.","").substring(0,6);
};

// --Event Listener --//
app.listen(PORT, (req) => {
  console.log(`Example app listening on port ${PORT}!`);
});

// -- post -- //  
//GET : crab information from front end  
//POST : sending info from backend to front-end
// new short URL add
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  // // log in
  // const userName = req.params.userName; 
  // userDatabase[userName] = userName;
  res.redirect(`/urls/${shortURL}`);         
});

// deleting feature
app.post("/urls/:shortURL/delete", (req , res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// editing feature
app.post("/urls/:shortURL/", (req, res) => {
   //objects are always unique elements.  Writing one always replaces the existing
   //this params means crab the information from the already show in the web front side
   const shortURL = req.params.shortURL; 
   const longURL = req.body.longURL;
   urlDatabase[shortURL] = longURL;
   res.redirect("/urls");
 });

 //log in submit
 app.post("/login", (req, res) => {
  const userName = req.body.username; 
  //userDatabase[userName] = userName;
  console.log(userName);
  res.cookie("username", userName );
  res.redirect("/urls");
});

 // -- get -- //
app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send("Hello!");
});


//app.listen(3000,"localhost");


app.get("/urls.json",(req, res) => {
   res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
  //cookie
  // res.cookie('userName','cookie value',{maxAge:60000}); 
  // res.send("set up cookie successfully !");
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies[ "username" ];
  const templateVars = {  username };
  res.render("urls_new", templateVars );
});

app.get("/urls", (req, res) => {
  // add username 
  const username = req.cookies[ "username" ];
  const templateVars = { urls: urlDatabase, username };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies[ "username" ];

  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const username = req.cookies[ "username" ];
  const templateVars = {  username };
  res.render("register",  templateVars);
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


/// log out
app.get("/logout", (req, res) => {
  // const userName = req.cookies['username']; 
  res.clearCookie("username");
  res.redirect("/urls");
});


// app.get("/urls/:username/", (req, res) => {

//   const username = req.params.username; 

//   userDatabase[username] = username;
//   res.redirect("/urls");
// });