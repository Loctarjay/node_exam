require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const path = require('path');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
db.on("error", (error) => console.error(error) );
db.once("open", () => console.log("Connection to Database"));
let users = [{
    username: "jay",
    password: '$2b$10$lxDnm5BeMYmHi/U6PbW0q.2lPiMC1e7UVeA8H.PKUqbZGZxlvYBhu',
    restriction: true
}];
let loggedIn = {
    username: null,
    restriction: null
}

const fs = require('fs');

// const header = fs.readFileSync(path.join(__dirname + "/public/content/global/header/header.html")).toString();
// const footer = fs.readFileSync(path.join(__dirname + "/public/content/global/footer/footer.html")).toString();

const loginPage = fs.readFileSync(path.join(__dirname + "/public/content/login/login.html")).toString();
const registerPage = fs.readFileSync(path.join(__dirname + "/public/content/register/register.html")).toString();
const pagesPage = fs.readFileSync(path.join(__dirname + "/public/content/pages/pageSelection.html")).toString();
const about = fs.readFileSync(path.join(__dirname + "/public/content/randomPages/about.html")).toString();
const texture = fs.readFileSync(path.join(__dirname + "/public/content/randomPages/texture-explanation.html")).toString();
const gameList = fs.readFileSync(path.join(__dirname + "/public/content/randomPages/game-list.html")).toString();


app.get("/", async (req, res) => {
    loggedIn = {
        username: null,
        restriction: null
    }
    console.log(loggedIn);
    return res.send( loginPage );
});

app.post("/", async (req, res) => {
    const loginUsername = req.body.username;
    console.log(users);

    for (let step = 0; step < users.length; step++) {
        console.log(users[step].username === loginUsername)
        if (users[step].username === loginUsername) {
            console.log(await bcrypt.compare(req.body.password, users[step].password));
            if (await bcrypt.compare(req.body.password, users[step].password)) {
                console.log("Success");
                loggedIn = users[step];
                return res.send( pagesPage );
            } else {
                console.log("Fail ... 2");
                return res.send( loginPag );
            }
        } else if( step == users.length ) {
            console.log("First failure");
            return res.send( loginPage );
        }
    }
    console.log(loggedIn.restriction);
});

app.get("/register", (req, res) => {
    return res.send( registerPage );
});


app.post("/register", async (req, res) => {
    //console.log(users);
    try {
        const username = req.body.username;
        const inputPassword = req.body.password;
        //console.log(username + " " + inputPassword);
        const hashedPassword = await bcrypt.hash(inputPassword, 10);
        //console.log(hashedPassword);
        const user = { username: username, password: hashedPassword, salt: 10, restriction: false};
        users.push(user);
        return res.send( loginPage );
        res.status(201).send();
    } catch {
        return res.send( registerPage );
        res.status(500).send();
    }
    //console.log(users);
});

app.get("/pages", (req, res) => {
    return res.send( pagesPage )
});

app.get("/about", (req, res) => {
    if ( !loggedIn.restriction ){
        return res.send( about );
    } else {
        return res.send( pagesPage );
    }
});

app.get("/texture", (req, res) => {
    if ( !loggedIn.restriction ){
        return res.send( texture );
    } else {
        return res.send( pagesPage );
    }
});

app.get("/game-list", (req, res) => {
    if ( loggedIn.restriction ){
        return res.send( gameList );
    } else {
        return res.send( pagesPage );
    }
});

app.get("/delete", async (req, res) => {
    try {
        try {
            const user = await User.findById(req.params.id);
            if ( user == null ) {
                return res.status(404).json( {message: "Cannot find user"} );
            }
        } catch (error) {
            return res.status(500).json( {message: error.message} )
        }
        await res.user.remote();
        return res.json( { message: "Deleted USer" } );
    } catch (error) {
        return res.status(500).json( {message: error.message} );
    }
});

const port = process.env.PORT || 9595;
app.listen(port, (error) => {
    if (error) {
        console.log("Server couldn't start: ", error);
    }
    console.log("Server started on port: ", Number(port));
});