# AhoraBondi

### A Node + Mongodb + Socket.io API real time tracking system project. Based on the example published in "Code for my blog" post - [How to build your own Uber-for-X App](https://medium.freecodecamp.com/how-to-build-your-own-uber-for-x-app-33237955e253#.hhddn3s2m)

### Online Demo (https://ahorabondi.glitch.me/):
		
	[Monitor] (https://ahorabondi.glitch.me/data.html)
	, [User] (https://ahorabondi.glitch.me/user)
	, [Driver 01] (https://ahorabondi.glitch.me/emitir/1)
	, [Driver 02] (https://ahorabondi.glitch.me/emitir/2)
	, [Driver 03] (https://ahorabondi.glitch.me/emitir/3)

### How to install:

- Clone or fork this repo
- Install NodeJS and MongoDB
- Run `sudo npm install`
- run `mongoimport --db myUberApp --collection drivers --drop --file ./drivers.json` to import sample cop information in MongoDB
- run `mongoimport --db myUberApp --collection requests --drop --file ./requests.json` to import sample crime information in MongoDB

### How to run: 

- run `node app.js`
- Open a demo user page by going to http://localhost:8000/user?userId=user1
- Open 3 or more driver pages from the imported driver profiles on separate tabs - [01](http://localhost:8000/emitir/01), [02](http://localhost:8000/emitir/2), [03](http://localhost:8000/emitir/3), [04](http://localhost:8000/emitir/4), [05](http://localhost:8000/emitir/5), [06](http://localhost:8000/emitir/6), [07](http://localhost:8000/emitir/7)