'use strict'

const express = require("express")
const path = require('path');
const fs = require('fs');

const app = express()
app.use(express.static(path.join(__dirname, "public")))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.post("/create", (req, res) => {
    try {
        const { name, svgData } = req.body;
        const filePath = path.join(__dirname, "public", "data", `${name}.svg`)
        fs.writeFileSync(filePath, svgData, 'utf-8')
        return res.json({ result: "success" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error saving SVG' });
    }
})

app.get("/images", (req, res) => {
    try {
        const dirPath = path.join(__dirname, "public", "data")
        const files = fs.readdirSync(dirPath)
        const sortedFiles = files.sort((a,b) => {
            return b.localeCompare(a)
        })
        return res.json({ files: sortedFiles })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Lấy Ảnh Thất Bại' });
    }
})

app.listen("3300", () => {
    console.log("server is running on port 3300")
})