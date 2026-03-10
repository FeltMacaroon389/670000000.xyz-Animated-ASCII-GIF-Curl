const http = require("http")

const frames = ["(>'-')>", "<('-'<)", "^('-')^"]

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })

  let i = 0

  setInterval(() => {
    res.write("\x1b[H")
    res.write(frames[i] + "\n")
    i = (i + 1) % frames.length
  }, 100)

}).listen(process.env.PORT || 3000)
