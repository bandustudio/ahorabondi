# Uber POC

## A Node + Mongodb + Socket.io API delivery system project. Based on the example published in "Code for my blog" post - [How to build your own Uber-for-X App](https://medium.freecodecamp.com/how-to-build-your-own-uber-for-x-app-33237955e253#.hhddn3s2m)

### Online Demo (https://uberpoc.devmeta.net/):

[Monitor] (https://uberpoc.devmeta.net/data.html)
, [User 1] (https://uberpoc.devmeta.net/user.html?UserId=user1)
, [User 2] (https://uberpoc.devmeta.net/user.html?UserId=user2)
, [Carrier 01] (https://uberpoc.devmeta.net/carrier.html?userId=01)
, [Carrier 02] (https://uberpoc.devmeta.net/carrier.html?userId=02)
, [Carrier 03] (https://uberpoc.devmeta.net/carrier.html?userId=03)

### How to install:

- Clone or fork this repo
- Install NodeJS and MongoDB
- Run `sudo npm install`
- run `mongoimport --db myUberApp --collection carriers --drop --file ./carriers.json` to import sample cop information in MongoDB
- run `mongoimport --db myUberApp --collection requests --drop --file ./requests.json` to import sample crime information in MongoDB

### How to run: 

- run `node app.js`
- Open a demo user page by going to http://localhost:8000/user.html?userId=user1
- Open 3 or more carrier pages from the imported carrier profiles on separate tabs - [01](http://localhost:8000/carrier.html?userId=01), [02](http://localhost:8000/carrier.html?userId=02), [03](http://localhost:8000/carrier.html?userId=03), [04](http://localhost:8000/carrier.html?userId=04), [05](http://localhost:8000/carrier.html?userId=05), [06](http://localhost:8000/carrier.html?userId=06), [07](http://localhost:8000/carrier.html?userId=07)