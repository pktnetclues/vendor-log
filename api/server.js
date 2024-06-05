const express = require("express")
const cors = require("cors")
const vendorRouter = require("./routes/route")
const sequelize = require("./utils/sequelize")
const app = express()

app.use(cors({
    origin: "http://localhost:5173"
}))


app.use(vendorRouter)

app.get("/", (req, res) => {
    res.json({ hello: "Pankaj" })
})

sequelize

app.listen(4000, () => {
    console.log("server is running on port 4000");
})