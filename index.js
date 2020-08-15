const express = require("express")
const app = express()
const fs = require("fs")
const Datastore = require("nedb")
const tmpPath = "tmp/locations.json"

let requests = null
const database = new Datastore("database/database.db")
database.loadDatabase()

const writeLocations = locationStr => {
  fs.writeFile(tmpPath, locationStr, err => {
    if (err) throw err
  })
}

const readLocations = (() => {
  fs.readFile(tmpPath, "utf8", function (err, data) {
    if (err) writeLocations
    requests = data === undefined ? [] : JSON.parse(data)
  })
})()

app.listen(3000, () => console.log("listening at 3000"))
app.use(express.static("public"))
app.use(express.json({ limit: "1mb" }))

app.post("/api", (req, res) => {
  const { lat, lon } = req.body
  requests.push({ lat, lon })
  writeLocations(JSON.stringify(requests))
  res.json({
    status: "success",
    latitude: lat,
    longitude: lon,
    reqPerformed: requests,
  })
})
