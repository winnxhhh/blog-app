### Blog Application ###
hello! welcome here ^_^. this is my project regarding the use of databases. for this project, we used sqlite and node.js. the link to the video website walkthrough is https://youtu.be/1eQ1-Mzw2SU .

if you would like to try this application out yourself, below are the instructions on how to set up, the additional libraries used, as well as a reccommended guide on my website's usage to fully maximise all its features. i hope you enjoy! 

## how to set up:
1. npm install
2. npm run build-db
3. npm run start

## additional libraries/packages used:
1. express-session (for the likes counter and views counter)
2. express-validator (for the settings input checker)

## how to use the blog for the best experience:
- type `http://localhost:3000` in your browser 
1. you may go as an Author first and go to the author webpage. there, you may do the following first (in no particular order):
    - create a new draft article (you may try clicking the back button instead clicking the 'create new draft' button to see an alert message pop up)
    - edit a draft article (you may try clicking the back button instead clicking the 'update draft' button to see an alert message pop up)
    - delete a draft article
    - publish > 2 draft articles
    - go to the settings page and change the settings (you may leave some fields blank here to see the error message)

2. after exploring the above, you may go back to the main homepage and go into the blog as a Reader. there, you may do the following:
    - view any articles
        - in the article read page, you may like the article
        - post at least 2 comments
        - click the back button to go back to the reader's homepage
        - click back into the same article to increase its view count to >2
        - click into another article once and DO NOT like it (we are trying to achieve different numbers of likes and views count between the articles)
        - click the back button to go back to the reader homepage
    - click sort by and sort the published articles accordingly

3. after exploring as a Reader, you may go access it as the Author again. there, you may do the following (in no particular order):
    - click sort by and sort the published articles accordingly
    - click the share button to trigger a pop up that has that article's url
    - view the article and enter the article read page (author's view). there, you may do the following
        - see any comments you made earlier
        - delete any comments (moderation feature)
    - delete a published article
