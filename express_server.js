const express = require("express");
const app = express();
const PORT = 3000; 
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static('public'));// for css or js

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   //短的算出來 random連結    長的連結 原本網址
//   "9sm5xK": "http://www.google.com"
// };

// const changeData = urlDatabase.urlDatabase[shortURL].Values={
//   longURL, 
//   userID
// } 
// shortURL ---> urlDatabase[key]
// longURL ---> urlDatabase[shortURL].longURL
// userID came from users{}
// userID ---> urlDatabase[shortURL].userID
// userID  -- > match if userID === urlDatabase[shortURL].userID => urlDatabase[shortURL]
const urlsForUser = (id) => {
  const myUrls = {};
  for(const shortUrl in urlDatabase){
    if(urlDatabase[shortUrl].userID === id){
      myUrls[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return myUrls;
}
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

function generateRandomString(stringInLength) {
  return Math.random().toString(36).replace("0.","").substring(0,6);
};
function emailCheckOut( email, users ) {
  for (let userID in users) {
    if (users[userID].email === email){
      return users[userID];
    }
  }
}
function pwCheckOut( password, users ) {
  for (let userID in users) {
    if (users[userID].password === password){
      return users[userID].id;
    }
  }
}

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
  urlDatabase[shortURL] = {longURL: longURL, userID: req.cookies.user_id};
  res.redirect(`/urls/${shortURL}`);         
});


// no need to change
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
   urlDatabase[shortURL].longURL = longURL;
   res.redirect("/urls");
 });

 //log in submit
app.post("/login", (req, res) => {
  const email = req.body.email; 
  const password = req.body.password;
  const user = emailCheckOut(email, users);
  if (user) {
    if (user.password === password) {
      res.cookie("user_id", user.id );
      res.redirect("/urls");
    } 
    res.sendStatus(403); 
  } 
  res.sendStatus(403);
});

 // register
app.post("/register", (req, res) => {
  const email = req.body.email; 
  const password = req.body.password;
  if (emailCheckOut(email, users)) {
    res.sendStatus(400);
  } else if(email.length < 1 || password.length < 1) {
    res.sendStatus(400);
  } else {
    const id = generateRandomString();
    users[id] = { id, email, password };
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});

 // -- get -- //
app.get("/", (req, res) => {
  //console.log(req.cookies);
  res.send("Hello!");
});

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
  const userID = req.cookies["user_id"];
  const user = users[ userID ];
  const templateVars = {  user };
  res.render("urls_new", templateVars);
});

// ---- here --- //
app.get("/urls", (req, res) => {
  // add user name 
  const userID = req.cookies["user_id"];
  if(!userID){
    res.redirect("/login")
    return
  } 
  const user = users[userID]; //obj
  let myUrls = urlsForUser(userID);
  
  const templateVars = { urls: myUrls, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = { user };
  res.render("register",  templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = { user };
  res.render("login",  templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});


app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});


/// log out
app.get("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

