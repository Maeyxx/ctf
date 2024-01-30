# Mong'eau CTF CHALLENGE
###### AUTHENTICATION AND NOSQL VULNERABILITIES
Made w/ ❤️ By [Maeyx](https://github.com/Maeyxx)
 

> - ⚡️Vue-router - To explore the web !
>- 🥝 Vue 3 - Composition API, syntax and more!
> - 🌈 Vuetify - THE CSS framework
> - 📦 Components auto importing
> - 🌟 Icons - Material design icons


## ✅  Prerequisites  (if using Docker, pass)
1. Download [NodeJS](https://nodejs.org/en) >=  v20.0.0
2. Download [MongoDB](https://www.mongodb.com/try/download/community)
3. Download [MongoDB Compass](https://www.mongodb.com/products/tools/compass)

## 🥇Run this project for the first time - ✅Auto loader
Run the project as Docker with docker-compose !
```
docker-compose up -d --build
```

## 🥈Run this project for the first time - ❌Without auto loader
Configure Database, import in your MongoDB Compass all datas 
```
Collections => import *.json
```
Configure .env file
```
VUE_APP_API_BASE_URL=http://<API_URL>:<API_PORT>

```

Go in the /app folder and download dependencies
```
npm i
```
```
npm run serve
```

Go in the /api folder and download dependencies
```
npm i
```
```
node .\server.js
```
