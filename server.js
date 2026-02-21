const http = require('http')
const url = require('url')

const PORT = process.env.PORT || 9818

function collectBodyData(req) {
    let body = ""

    return new Promise((resolve) => {
        req.on("data", (chunk) => {
            body += chunk.toString()
        })

        req.on("end", () => {
            try {
                resolve(JSON.parse(body))
            } catch {
                resolve({})
            }
        })
    })
}

async function onClientRequest(req, res) {

    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname
    const query = parsedUrl.query

    res.setHeader('Content-Type', 'application/json')

    // ================= GET =================
    if (req.method === 'GET') {

        if (path === '/' || path === '') {

            if (query.message !== undefined) {
                return res.end(
                    JSON.stringify({ msg: "Hello, How are you?" })
                )
            }

            return res.end(
                JSON.stringify({ msg: "Hello" })
            )
        }

        res.statusCode = 404
        return res.end(JSON.stringify({ error: "Not Found" }))
    }

    // ================= POST =================
    if (req.method === 'POST' && path === '/api/sayhi') {

        const body = await collectBodyData(req)
        const name = body.name || ""

        return res.end(
            JSON.stringify({ msg: `Hello ${name}, How are you?` })
        )
    }

    // ================= อื่น ๆ =================
    res.statusCode = 405
    res.end(JSON.stringify({ error: "Method Not Allowed" }))
}

const server = http.createServer(onClientRequest)

server.listen(PORT, () => {
    console.log('Server started listening on port ' + PORT)
})
