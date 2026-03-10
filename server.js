const fs = require("fs")
const http = require("http")

const frames = fs.readdirSync("./ascii")
  .sort()
  .map(f => fs.readFileSync("./ascii/" + f, "utf8"))

http.createServer((req, res) => {

  const ua = req.headers["user-agent"] || ""

  // browser response
  if (!ua.includes("curl")) {
    res.writeHead(200, {"Content-Type":"text/html"})
    res.end(`
	  <!DOCTYPE html>
      <html>
      <body>
      <h1>67 :D</h1>
      </body>
      </html>
    `)
    return
  }

  // curl response
  res.writeHead(200, {"Content-Type":"text/plain"})

  let i = 0

  setInterval(() => {
    res.write("\x1b[H")        // move cursor to top
    res.write(frames[i])
    i = (i + 1) % frames.length
  }, 80)

}).listen(process.env.PORT || 3000)
