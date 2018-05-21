# AhoraBondi

### A Node + Mongodb + Socket.io API real time tracking system project. Based on the example published in "Code for my blog" post - [How to build your own Uber-for-X App](https://medium.freecodecamp.com/how-to-build-your-own-uber-for-x-app-33237955e253#.hhddn3s2m)

### Online Demo (https://ahora.glitch.me/):
		
	[Monitor] (https://ahora.glitch.me/data.html)
	, [User] (https://ahora.glitch.me/user)
	, [Driver 01] (https://ahora.glitch.me/emitir/1)
	, [Driver 02] (https://ahora.glitch.me/emitir/2)
	, [Driver 03] (https://ahora.glitch.me/emitir/3)

### How to install:

- Clone or fork this repo
- Install NodeJS and MongoDB
- Run `sudo npm install`
- run `mongoimport --db ahorabondi --collection drivers --drop --file ./drivers.json` to import sample cop information in MongoDB

### How to run: 

- run `node server.js`
- Open a demo user page by going to http://localhost:8000