/**
* index.js
* This is your main app entry point
*/

// Set up express, bodyparser and EJS
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

app.use(session({
    secret: 'dnwMidterms2',
    resave: false,
    saveUninitialized: true
}));

// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

app.get('/', (req, res) => {
    const setting_id = 1;
    let querySetting = "SELECT * FROM settings WHERE setting_id = ?";

    // Execute the query
    global.db.all(querySetting, [setting_id], (err, set) => {
        if (err) {
            next(err); // Pass the error to the error handler
        } 
        res.render("homepage.ejs", { settingsList: set });
    });
});


// Add all the route handlers in usersRoutes to the app under the path /articles
const articlesRoutes = require('./routes/articles');
app.use('/articles', articlesRoutes);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

