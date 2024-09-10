/**
 * articles.js
 */
//note: all code here is written by me, using the user.js previously given as reference + referred to a coursera lab for the error checker in /editsettings
const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator');

//get route for the Author button in the main homepage
router.get('/authorPage', (req, res, next) => {
    let queryDraft = "SELECT * FROM articles";

    //queries the articles table to get all the draft articles
    global.db.all(queryDraft, (err, result) => {
        if (err) 
        {
            next(err); 
        } 

        let queryPub = "SELECT * FROM publishedArticles ORDER BY article_id DESC";
        const userOption = String(req.query.filters); //converts the value of req.query.filters to a string
    
        //conditional if statement to sort through the published articles
        if(userOption == 'likesNum')
        {
            queryPub = "SELECT * FROM publishedArticles ORDER BY likes DESC";
        }
        else if(userOption == 'viewsNum')
        {
            queryPub = "SELECT * FROM publishedArticles ORDER BY views DESC";
        }
        else if(userOption == 'publishDate')
        {
            queryPub = "SELECT * FROM publishedArticles ORDER BY article_id DESC";
        }

        //queries the publishedArticles table to get all the published articles, order depends on how the user sorts    
        global.db.all(queryPub, (err, articlePub) => {
            if (err) 
            {
                next(err); //passes error handler
            } 

            //set setting_id to always be 1
            const setting_id = 1;
            let querySetting = "SELECT * FROM settings WHERE setting_id = ?";

            //queries the settings table to update the setting to the data in setting_id = 1  
            global.db.all(querySetting, [setting_id], (err, set) => {
                if (err) 
                {
                    next(err); //passes error handler
                } 

                //renders authorHome.ejs
                res.render("authorHome.ejs", { draftArticlesList: result,
                                    publishedArticlesList: articlePub,
                                    settingsList: set
                                    });
            });
        });
    });
});

//get route for the settings button in the authorHome, containing the current data in setting_id
router.get('/settingsPage/:setting_id', (req, res, next) => {
    const setting_id = req.params.setting_id;
    let query = "SELECT * FROM settings WHERE setting_id = ?";
    
    //queries the settings table to update the setting to the data in setting_id = 1  
    global.db.all(query, [setting_id], (err, set) => {
        if (err) 
        {
            next(err); //passes error handler
        } 
        
        //renders settings.ejs
        res.render("settings.ejs", { settingsList: set, errors: [] });
    });
});

//post route when the settings form is submitted
router.post("/editsettings", 
[
    check('settingSubtitle').isLength({min: 1}).withMessage('Subtitle field cannot be blank.'), //gives a message when subtitle input is blank 
    check('settingTitle').isLength({min: 1}).withMessage('Title field cannot be blank.'), //gives a message when title input is blank 
    check('settingName').isLength({min: 1}).withMessage('Name field cannot be blank') //gives a message when name input is blank 

], (req, res, next) => {
    const query = "UPDATE settings SET settingTitle = ?, settingSubtitle = ?, settingName = ? WHERE setting_id = 1;"
    query_parameters = [req.body.settingTitle,
                        req.body.settingSubtitle, 
                        req.body.settingName];
     
    //for checking and validating settings inputs                     
    const errors = validationResult(req);
    if(!errors.isEmpty()) 
    {
        const fetchQuery = "SELECT * FROM settings WHERE setting_id = ?";
        global.db.all(fetchQuery, [req.body.setting_id], (err, set) => {
            if (err) 
            {
                next(err); //passes error handler
            } 
            else 
            {
                //renders settings.ejs again with the error messages if any of the input fields are blank
                res.render("settings.ejs", { settingsList: set, errors: errors.array() });
            }
        });
    } 
    else 
    {
        global.db.run(query, query_parameters, function (err) {
            if (err) 
            {
                next(err); //passes error handler
            } 
            else
            {
                //redirects page back to authorHome.ejs when form is successfully submitted
                res.redirect('/articles/authorPage');
            }
        });
    }
});

//get route for the Reader button in the main homepage
router.get('/readerPage', (req, res, next) => {
    const userOption = String(req.query.filters);
    let queryPub = "SELECT * FROM publishedArticles ORDER BY article_id DESC";

    //conditional if statement to sort through the published articles
    if(userOption == 'likesNum')
    {
        queryPub = "SELECT * FROM publishedArticles ORDER BY likes DESC";
    }
    else if(userOption == 'viewsNum')
    {
        queryPub = "SELECT * FROM publishedArticles ORDER BY views DESC";
    }
    else if(userOption == 'publishDate')
    {
        queryPub = "SELECT * FROM publishedArticles ORDER BY article_id DESC";
    }

    //queries the publishedArticles table to get all the published articles, order depends on how the user sorts    
    global.db.all(queryPub, (err, articlePub) => {
        if (err) 
        {
            next(err); //passes error handler
        } 

        //set setting_id to always be 1
        const setting_id = 1;
        let querySetting = "SELECT * FROM settings WHERE setting_id = ?";

        //queries the settings table to update the setting to the data in setting_id = 1  
        global.db.all(querySetting, [setting_id], (err, set) => {
            if (err) 
            {
                next(err); // Pass the error to the error handler
            } 
            
            //renders readerHome.ejs
            res.render("readerHome.ejs", { publishedArticlesList: articlePub,
                                            settingsList: set });
        });
    });
});

//get route for the Create New Draft button in the Author homepage
router.get("/newdraft", (req, res) => {
    //allows the date and time to be captured when user clicks the button
    const dateCreated = new Date().toLocaleString('en-UK', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    //set setting_id to always be 1
    const setting_id = 1;
    let querySetting = "SELECT * FROM settings WHERE setting_id = ?";

    //queries the settings table to update the setting to the data in setting_id = 1  
    global.db.all(querySetting, [setting_id], (err, set) => {
        if (err) 
        {
            next(err); //passes error handler
        } 

        //renders addNewDraft.ejs
        res.render("addNewDraft.ejs", { dateCreated, settingsList: set });
    });
});

//post route when the create new draft form is submitted
router.post("/newdraft", (req, res, next) => {
    const query = "INSERT INTO articles (articleTitle, articleDesc, articleContent, articleCreated, articleUpdated) VALUES(?, ?, ?, ?, ?);"
    query_parameters = [req.body.articleTitle, req.body.articleDesc, req.body.articleContent, req.body.articleCreated, req.body.articleUpdated];
    
    //takes the input values in the respective fields and inserts them into the articles table if form is succesfully submitted
    global.db.run(query, query_parameters, function (err) {
            if (err) 
            {
                next(err); //passes error handler
            } 
            else 
            {
                //redirects to author's homepage once form is submitted successfully
                res.redirect('/articles/authorPage');
            }
        }
    );
});

//get route for the edit draft button in author homepage
router.get("/editdraft/:article_id", (req, res, next) => {
    //gets the article_id of the article we want to edit
    const article_id = req.params.article_id;

    //allows the date and time to be captured when user clicks the button
    const dateUpdated = new Date().toLocaleString('en-UK', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    let query = "SELECT * FROM articles WHERE article_id = ?";

    //selects the relevant data from our requested article_id
    global.db.all(query, [article_id], (err, blogArticle) => {
        if (err) 
        {
            next(err); //passes error handler
        } 
        else 
        {
            //set setting_id to always be 1
            const setting_id = 1;
            let querySetting = "SELECT * FROM settings WHERE setting_id = ?";

            //queries the settings table to update the setting to the data in setting_id = 1  
            global.db.all(querySetting, [setting_id], (err, set) => {
                if (err) 
                {
                    next(err); //passes error handler
                } 
             
                //renders articleEdit.ejs
                res.render('articleEdit',  { blogArticleList: blogArticle,
                                            dateUpdated,
                                            settingsList: set });
            });
        }
    });
});

//post route when the edit draft form is submitted
router.post("/editdraft", (req, res, next) => {
    const query = "UPDATE articles SET articleTitle = ?, articleDesc = ?, articleContent = ?, articleUpdated = ? WHERE article_id = ?;"
    query_parameters = [req.body.articleTitle,
                        req.body.articleDesc, 
                        req.body.articleContent,
                        req.body.articleUpdated,
                        req.body.article_id];
    
    //articles table is updated with the data we newly input 
    global.db.run(query, query_parameters, function (err) {
            if (err) 
            {
                next(err); //passes error handler
            } 
            else 
            {
                //redirects to author homepage once form is submitted successfully
                res.redirect('/articles/authorPage');
            }
        });
});

//post route when the publish button is pressed
router.post("/publish/:article_id", (req, res, next) => {
    //gets the article_id of the article we want to publish
    const article_id = req.params.article_id;

    //selects the row of data of the requested article_id from the articles table 
    const query = "SELECT * FROM articles WHERE article_id = ?;"
    
    global.db.get(query, [article_id], (err, articlePub) => {
        if (err) {
            return next(err); //passes error handler
        }
        //inserts the data selected above into the publishedArticles table
        const insertQuery = `INSERT INTO publishedArticles (articleTitle, articleDesc, articleContent, articleCreated, articleUpdated, articlePublished) VALUES (?, ?, ?, ?, ?, ?)`;
        
        //allows the date and time to be captured when user clicks the button
        const publishDate = new Date().toLocaleString('en-UK', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const query_parameters = [articlePub.articleTitle, 
                                    articlePub.articleDesc, 
                                    articlePub.articleContent, 
                                    articlePub.articleCreated, 
                                    articlePub.articleUpdated, 
                                    publishDate];

        //runs the insert query above
        global.db.run(insertQuery, query_parameters, function (err) {
            if (err) 
            {
                return next(err); //passes error handler
            }

            //deletes the selected data from the articles table after inserting it into the publishedArticles table
            const deleteQuery = "DELETE FROM articles WHERE article_id = ?;"
            global.db.run(deleteQuery, [article_id], (err) => {
                if (err) 
                {
                    return next(err); //passes error handler
                }

                //redirects to the author homepage again once all of the above is successful
                res.redirect('/articles/authorPage');
            });
        });
    });
});

//post route when the delete button in the Draft Articles table is pressed
router.post("/deleteDraft/:article_id", (req, res, next) => {
    //gets the article_id of the article we want to delete
    const article_id = req.params.article_id;
    const query = "DELETE FROM articles WHERE article_id = ?;"

    //deletes all the data from the articles table in the requested article_id
    global.db.run(query, [article_id], (err) => {
        if(err)
        {
            return next(err); //passes error handler
        }

        //redirects back to author homepage after the above is executed
        res.redirect('/articles/authorPage');
    });
});

//post route when the delete button in the Published Articles table is pressed
router.post("/deletePublished/:article_id", (req, res, next) => {
    //gets the article_id of the article we want to delete
    const article_id = req.params.article_id;
    const query = "DELETE FROM publishedArticles WHERE article_id = ?;"

    //deletes all the data from publishedArticles table in the requested article_id
    global.db.run(query, [article_id], (err) => {
        if(err)
        {
            return next(err); //passes error handler
        }

        //redirects back to author homepage after the above is executed
        res.redirect('/articles/authorPage');
    });
});

//get route for back buttons in author pages
router.get("/backAuthor", (req, res) => {
    //redirects to author homepage
    res.redirect('/articles/authorPage');
})

//get route for back buttons in reader pages
router.get("/backReader", (req, res) => {
    //redirects to reader homepage
    res.redirect('/articles/readerPage');
})

//get route for back buttons in author homepage and reader homepage
router.get("/backAll", (req, res) => {
    //redirects to main homepage
    res.redirect('/');
})

//get route for when view article button is pressed from reader homepage
router.get("/readArticle/:article_id", (req, res, next) => {
    //gets the article_id of the article we want to view
    const article_id = req.params.article_id;
    const articleQuery = "SELECT * FROM publishedArticles WHERE article_id = ?";
    
    //initialises an object for view counter
    if (!req.session.views) 
    {
        req.session.views = {};
    }

    //selects the relevant data from our requested article_id
    global.db.all(articleQuery, [article_id], (err, articlePub) => {
        if (err) {
            next(err); //passes error handler
        } 

        //set setting_id to always be 1
        const setting_id = 1;
        let querySetting = "SELECT * FROM settings WHERE setting_id = ?";

        //queries the settings table to update the setting to the data in setting_id = 1  
        global.db.all(querySetting, [setting_id], (err, set) => {
            if (err)
            {
                next(err); //passes error handler
            } 

            //selects data of comments under the requested article_id
            const commentQuery = "SELECT * FROM comments WHERE article_id = ? ORDER BY comment_id DESC";
            
            //allows the date and time to be captured when user clicks the button
            const commentDate = new Date().toLocaleString('en-UK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            //all data under the requested article_id foreign key is selected from the comments table
            global.db.all(commentQuery, [article_id], (err, comments) => {
                if (err) 
                {
                    next(err); //passes error handler
                } 
                else 
                {
                    //converts pathname url to a string
                    let pathname = String(req.path);

                    //conditionals for views counter
                    if (!req.session.views[pathname]) 
                    {
                        req.session.views[pathname] = 0;
                    }

                    //increment views count by 1 for every time the pathname url is called
                    req.session.views[pathname]++;
                    next();

                    //takes the number of views on the particular url
                    const viewsNum = req.session.views[pathname];
                    const viewQuery = "UPDATE publishedArticles SET views = ? WHERE article_id = ?;"

                    //renders articlePublished.ejs
                    res.render('articlePublished', { publishedArticlesList: articlePub,
                                                    viewsNum,
                                                    commentDate,
                                                    commentsList: comments,
                                                    likes: req.session.likes || articlePub.likes,
                                                    settingsList: set
                    });

                    //runs the view counter after the webpage has been rendered
                    global.db.run(viewQuery, [viewsNum, article_id], (err) => {
                        if(err)
                        {
                            next(err); //passes error handler
                        }
                    });
                };
            }); 
        });       
    });
});

//post route when post comment button is pressed
router.post("/:article_id/newcomment", (req, res, next) => {
    //gets the article_id of the article we want to view
    const article_id = req.params.article_id;
    const query = "INSERT INTO comments (commentName, commentContent, commentCreated, article_id) VALUES(?, ?, ?, ?);";
    const query_parameters = [req.body.commentName, req.body.commentContent, req.body.commentCreated, article_id];

    //inserts input data into comments table, according to the article_id foreign key 
    global.db.run(query, query_parameters, function (err){
        if (err) 
        {
            return next(err); //passes error handler
        }

        //sets pathname to be current article url
        let pathname = `/readArticle/${article_id}`;

        //reduces view count by 1 everytime a comment is posted as it will refresh the page and add to the view count, ensures that view count is not duplicated unnecessarily
        req.session.views[pathname]--;

        //takes the number of views on the particular url
        const viewsNum = req.session.views[pathname];
        const viewQuery = "UPDATE publishedArticles SET views = ? WHERE article_id = ?;"
        
        //runs the view counter after the webpage has been rendered
        global.db.run(viewQuery, [viewsNum, article_id], function(err){
            if(err)
            {
                next(err) //passes error handle
            }
            //redirects to the same article
            res.redirect(`/articles/readArticle/${article_id}`);
        });
    });
});

//post route when like button is pressed
router.post("/:article_id/newlike", (req, res, next) => {
    //gets the article_id of the article we want to like
    const article_id = req.params.article_id
    const query = "UPDATE publishedArticles SET likes = ? WHERE article_id = ?;"
    query_parameters = [parseInt(req.body.likes), article_id]; //parseInt the likes count as our table only takes integers for the likes field

    //updates the likes count on the article with the requested article_id
    global.db.run(query, query_parameters, function(err){
        if(err)
        {
            next(err) //passes error handler
        }

        //sets pathname to be current article url
        let pathname = `/readArticle/${article_id}`;

        //reduces view count by 1 everytime the article is liked as it will refresh the page and add to the view count, ensures that view count is not duplicated unnecessarily
        req.session.views[pathname]--;

        //takes the number of views on the particular url
        const viewsNum = req.session.views[pathname];
        const viewQuery = "UPDATE publishedArticles SET views = ? WHERE article_id = ?;"
        
        //runs the view counter after the webpage has been rendered
        global.db.run(viewQuery, [viewsNum, article_id], function(err){
            if(err)
            {
                next(err) //passes error handler
            }
            //ensures that likes is an integer as our likes field in the publishedArticles table only stores integers
            req.session.likes = parseInt(req.body.likes);

            //redirects to the same article
            res.redirect(`/articles/readArticle/${article_id}`);
        });
    })
})

//get route when view article button is pressed in authors homepage
router.get("/articleMod/:article_id", (req, res, next) => {
    //gets the article_id of the article we want to view and moderate
    const article_id = req.params.article_id;
    const articleQuery = "SELECT * FROM publishedArticles WHERE article_id = ?";

    //selects the relevant data from our requested article_id
    global.db.all(articleQuery, [article_id], (err, articlePub) => {
        if (err) 
        {
            next(err); //passes error handler
        } 
        //set setting_id to always be 1
        const setting_id = 1;
        let querySetting = "SELECT * FROM settings WHERE setting_id = ?";

        //queries the settings table to update the setting to the data in setting_id = 1  
        global.db.all(querySetting, [setting_id], (err, set) => {
            if (err) 
            {
                next(err); //passes error handler
            } 

            //selects data of comments under the requested article_id
            const commentQuery = "SELECT * FROM comments WHERE article_id = ? ORDER BY comment_id DESC";
            
            //allows the date and time to be captured when user clicks the button
            const commentDate = new Date().toLocaleString('en-UK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            //all data under the requested article_id foreign key is selected from the comments table
            global.db.all(commentQuery, [article_id], (err, comments) => {
                if (err) 
                {
                    next(err); //passes error handler
                } 
                else 
                {
                    //renders articleAuthor.ejs
                    res.render('articleAuthor', {
                        publishedArticlesList: articlePub,
                        commentDate,
                        commentsList: comments,
                        likes: req.session.likes || articlePub.likes,
                        settingsList: set
                    });
                };
            }); 
        });       
    });
});

//post route when delete button in article author view is pressed
router.post("/deleteComment/:comment_id", (req, res, next) => {
    //gets the article_id and comment_id of the article we want to view and comment we want to delete respectively
    const comment_id = req.params.comment_id;
    const article_id = req.query.article_id
    const query = "DELETE FROM comments WHERE comment_id = ?;"

    //deletes all data under the requested article_id and comment_id from the comments table
    global.db.run(query, [comment_id], (err) => {
        if(err)
        {
            return next(err); //passes error handler
        }

        //redirects to the same article page
        res.redirect(`/articles/articleMod/${article_id}`);
    })
})

//export the router object so index.js can access it
module.exports = router;
