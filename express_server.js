const express = require("express");
const getUserByEmail = require("./helpers");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static('public'));// for css or js
app.use(cookieSession({
  name: 'session',
  keys: ["this is a bubble tea shop"],
}));

// shortURL ---> urlDatabase[key]
// longURL ---> urlDatabase[shortURL].longURL
// userID came from users{}
// userID ---> urlDatabase[shortURL].userID
// userID  -- > match if userID === urlDatabase[shortURL].userID => urlDatabase[shortURL]
const urlsForUser = (id) => {
  const myUrls = {};
  for (const shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === id) {
      myUrls[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return myUrls;
};
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

const generateRandomString = function() {
  return Math.random().toString(36).replace("0.","").substring(0,6);
};

//--routine--//
//GET : crab info from front end
//POST : sending info from backend to front-end


// -- post -- //
// new short URL add
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {longURL: longURL, userID: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});

// deleting feature
app.post("/urls/:shortURL/delete", (req , res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] ? urlDatabase[req.params.shortURL].longURL : '', user };
  if (!userID) {
    res.redirect("/login");
    return;
  }
  if(urlDatabase[req.params.shortURL].userID !== userID ){
    res.sendStatus(400);
    res.send("Unauthorize!");
  }
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
  const user = getUserByEmail(email, users);
  if (!user) {
    res.sendStatus(403);
    return;
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.sendStatus(403);
  }
});

// register
app.post("/register", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (getUserByEmail(email, users)) {
    res.sendStatus(400);
    return;
  }
  if (email.length < 1 || password.length < 1) {
    res.sendStatus(400);
    return;
  }
  
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password: hashedPassword
  };
  req.session.user_id = id;
  res.redirect("/urls");
});

// -- get -- //
app.get("/", (req, res) => {
  const userID = req.session["user_id"];
  if (!userID) {
    res.redirect("/login");
    return;
  }
  res.redirect("/urls");
});

app.get("/urls.json",(req, res) => {
  res.json(urlDatabase);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});


app.get("/urls/new", (req, res) => {
  const userID = req.session["user_id"];
  const user = users[ userID ];
  const templateVars = { user };
  if (!userID) {
    res.redirect("/login");
    return;
  }
  res.render("urls_new", templateVars);

});

// ---- here --- //
app.get("/urls", (req, res) => {
  // add user name
  const userID = req.session["user_id"];
  if (!userID) {
    res.redirect("/login");
    return;
  }
  const user = users[userID]; //obj
  let myUrls = urlsForUser(userID);
  
  const templateVars = { urls: myUrls, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] ? urlDatabase[req.params.shortURL].longURL : '', user };
   

  if (!userID) {
    res.redirect("/login");
    return;
  }
  if(urlDatabase[req.params.shortURL].userID !== userID ){
    res.sendStatus(400);
    res.send("Unauthorize!");
  }
  
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const templateVars = { user };
  res.render("register",  templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const templateVars = { user };
  res.render("login",  templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

/// log out
app.get("/logout", (req, res) => {
  req.session = null; // clear the cookie
  res.redirect("/urls");
});

app.get("*", (req, res) => {
  res.redirect("/login");
});

// --Event Listener --//
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});