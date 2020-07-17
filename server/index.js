const bodyParser = require("body-parser")
const cors = require("cors")
const dbConfig = require("./dbConfig").connectArgs
const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const morgan = require("morgan")
const router = require("./router")

const app = express()

//db setup
mongoose.connect(dbConfig.dbAdress, dbConfig.options).catch(err => {
    console.log('***********Error occurred************')
    console.log(error)
}).then(() => {
    console.log("connected to", dbConfig.dbAdress)
})

//app setup
app.use(morgan("combined"))
app.use(cors())
app.use(bodyParser.json({type: '*/*'}))
router(app)

//server setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log("server listening on", port)