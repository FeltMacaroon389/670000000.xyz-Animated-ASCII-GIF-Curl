const http = require("http")
const fs = require("fs")
const path = require("path")

const frames = fs.readdirSync("./ascii")
  .sort()
  .map(f => fs.readFileSync("./ascii/" + f, "utf8"))

const mime = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".gif": "image/gif"
}

http.createServer((req, res) => {

  const ua = req.headers["user-agent"] || ""
  const isCurl = ua.includes("curl")

  // curl, ASCII animation
  if (isCurl) {

    res.writeHead(200, {"Content-Type": "text/plain"})

    res.write("\x1b[2J")
    res.write("\x1b[H")

    let i = 0

    setInterval(() => {
      res.write("\x1b[H")
      res.write(frames[i])
      i = (i + 1) % frames.length
    }, 80)

    return
  }

  // browser, static files
  let filePath = path.join("public", req.url)

  if (req.url === "/") {
    filePath = "public/index.html"
  }

  fs.readFile(filePath, (err, data) => {

    if (err) {
      res.writeHead(404)
      res.end("Not found")
      return
    }

    const ext = path.extname(filePath)

    res.writeHead(200, {
      "Content-Type": mime[ext] || "text/plain; charset=utf-8"
    })

    res.end(data)
  })

}).listen(process.env.PORT || 3000)
