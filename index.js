const express = require("express")
const app = express()
const Datastore = require("nedb")
const { response } = require("express")

const database = new Datastore("database/database.db")
database.loadDatabase()

app.listen(3000, () => console.log("listening at 3000"))
app.use(express.static("public"))
app.use(express.json({ limit: "1mb" }))

app.get("/api", (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end()
      return
    }
    res.json(data)
  })
})

app.post("/api", (req, res) => {
  const data = req.body
  const timestamp = Date.now()
  data.timestamp = timestamp
  database.insert(data)
  res.json({
    data,
  })
})
