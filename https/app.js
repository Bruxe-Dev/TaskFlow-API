import https from 'https'
import fs from 'fs'
import path from 'path'
import { error } from 'console'
import crypto from 'crypto'

const sslOption = {

    //Point to the certificate and the key
    key: fs.readFileSync(new URL('key.pem', import.meta.url)),
    cert: fs.readFileSync(new URL('cert.pem', import.meta.url)),

    minVersion: 'TLSv1.2', //Requires all the security features

    //Recommended Security Settings
    secureOptions: crypto.constants.SSL_OP_NO_SSLv3 |
        crypto.constants.SSL_OP_NO_TLSv1 |
        crypto.constants.SSL_OP_NO_TLSv1_1
}


const server = https.createServer(sslOption, (req, res) => {
    res.setHeader('Strict-Transport-Security', 'max-age=172800; includeSubDomains') //Tells the browser to only load the site only using https but never https
    res.setHeader('X-Content-Type-Options', 'nosniff') //Tells the browser to stop guessing the file type this prevents hackers from sending malkicious files named as .jpg and the browser can execute them as JavaScript
    res.setHeader('X-Frame-Options', 'SAMEORIGIN') //Tells the browser, out site can not be put in anothers sites <ifame> only if the other site is a subdomain
    res.setHeader('X-XSS-Protection', '1; mode=block') //Tells the browser that if any Cross-Site Scripting is detected stop loading the Site immediately
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin') //Prevents that our url information can be seen in a third party site


    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        return res.end('<h1>Welcome to TaskFlow</h1> <p>Here your connection is Secure</p>')
    } else if (req.url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }))
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Page not found')
})

server.on('error', (error) => {
    console.error("Internal Server Error", error.message)
})

const PORT = 3000
server.listen(PORT, '0.0.0.0', () => {
    console.log(`App listening on port ${PORT}`)
})