const http = require('http')
const express = require('express')
const fs = require('fs/promises')
const { Server: SocketServer } = require('socket.io')
const path = require('path')
const cors = require('cors')
const chokidar = require('chokidar');
const os = require('os');
const pty = require('node-pty')

// Determine the shell to use based on the operating system
var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
// Define the current working directory for the shell
const cwd = path.resolve(__dirname, 'user');
// Spawn a new pseudo-terminal
var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',  // Terminal type
    cols: 80,             // Number of columns
    rows: 30,             // Number of rows
    cwd: cwd,             // Current working directory
    env: process.env      // Environment variables
});

// Create an Express application
const app = express()
// Create an HTTP server
const server = http.createServer(app);
// Create a new Socket.IO server with CORS enabled
const io = new SocketServer({
    cors: '*'
})

// Enable CORS for the Express app
app.use(cors())

// Attach the Socket.IO server to the HTTP server
io.attach(server);

// Watch the 'user' directory for changes using Chokidar
chokidar.watch('./user').on('all', (event, path) => {
    // Emit a 'file:refresh' event to the clients when a change is detected
    io.emit('file:refresh', path)
});

// Listen for data from the pseudo-terminal and emit it to the clients
ptyProcess.onData(data => {
    io.emit('terminal:data', data)
})

// Handle new client connections
io.on('connection', (socket) => {
    console.log(`Socket connected`, socket.id)

    // Emit a 'file:refresh' event to the newly connected client
    socket.emit('file:refresh')

    // Handle 'file:change' events from clients to update file content
    socket.on('file:change', async ({ path, content }) => {
        await fs.writeFile(`./user${path}`, content)
    })

    // Handle 'terminal:write' events from clients to write data to the terminal
    socket.on('terminal:write', (data) => {
        console.log('Term', data)
        ptyProcess.write(data);
    })
})

// Endpoint to get the file tree structure of the 'user' directory
app.get('/files', async (req, res) => {
    const fileTree = await generateFileTree('./user');
    return res.json({ tree: fileTree })
})

// Endpoint to get the content of a specific file
app.get('/files/content', async (req, res) => {
    const path = req.query.path;
    const content = await fs.readFile(`./user${path}`, 'utf-8')
    return res.json({ content })
})

// Start the server on port 9000
server.listen(9000, () => console.log(`Server running on port 9000`))

// Function to generate a file tree structure recursively
async function generateFileTree(directory) {
    const tree = {}

    // Recursive function to build the file tree
    async function buildTree(currentDir, currentTree) {
        const files = await fs.readdir(currentDir)

        for (const file of files) {
            const filePath = path.join(currentDir, file)
            const stat = await fs.stat(filePath)

            if (stat.isDirectory()) {
                currentTree[file] = {}
                await buildTree(filePath, currentTree[file])
            } else {
                currentTree[file] = null
            }
        }
    }

    await buildTree(directory, tree);
    return tree
}