# movies-explorer-api
backend for diploma project  

It uses Mongo.db to collect data. You can register a new user, change profile information, save cards (like) and delete them (dislike). You can login by e-mail and password, your logged in status will be saved for 7 days in cookies, so you don't need to sign in within these days. Also you can logout, so new login is needed.

To start:    
Clone repo to your local machine. Then install dependencies by
```javascript
npm install
``` 
then use
```javascript
npm start
``` 
to start it. Automatically it will run on http://localhost:3000/   

To use with my frontend go to [https://github.com/nemenova/movies-explorer-frontend] and use instructions in README.md there.  

technologies:
node.js   
express   
winston   
validator   
rate limiter  

deployed to 
[here](https://backend.nemenova.nomoredomains.club "VM is located at Yandex.Cloud")  

