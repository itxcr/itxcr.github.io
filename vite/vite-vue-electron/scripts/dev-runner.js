const {createServer, createLogger, build} = require('vite')
const {RENDERER_ROOT, MAIN_ROOT} = require("./constants");
const chalk = require("chalk");
const path = require('path')
const { spawn } = require('child_process')
const electron = require('electron')


let manualRestart
let electronProcess

// 启动 dev
async function startRenderer() {
    try {
        const viteServer = await createServer({
            root: RENDERER_ROOT
        })
        await viteServer.listen()
        return viteServer
    } catch (e) {
        createLogger().error(chalk.red(`启动本地调试失败:\n${e.stack}`))
    }
}

// 监听主进程
async function watchMainProcess() {
    try {
        const rollupWatcher = await build({
            root: MAIN_ROOT, mode: "development", build: {
                emptyOutDir: false, outDir: path.resolve(__dirname, "../dist/dev"), watch: true
            }
        })
        return await new Promise((resolve => {
            rollupWatcher.on("event", (event) => {
                if (event.code === "BUNDLE_END") {
                    resolve(rollupWatcher)
                }
            })
        }))
    } catch (e) {
        createLogger().error(chalk.red(`监听主进程出错:\n${e.stack}`))
        process.exit(1)
    }
}

function startElectron(RENDERER_URL) {
    let args = ['--inspect=5858', path.join(__dirname, "../dist/dev/main.cjs.js")]

    if (process.env.npm_execpath.endsWith("yarn.js")) {
        args = args.concat(process.argv.slice(3))
        console.log(args, 'yarn')
    } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
        args = args.concat(process.argv.slice(2))
        console.log(args, 'npm-cli')
    }
    electronProcess = spawn(electron, args, {
        env: {
            RENDERER_URL
        }
    })

    electronProcess.on('close', () => {
        if (!manualRestart) process.exit()
    })
}

async function start() {
    const rendererServer = await startRenderer()
    const {port = 3000, https = false} = rendererServer.config.server
    const RENDERER_URL = `http${https ? 's' : ''}://localhost:${port}`
    const mainWatcher = await watchMainProcess()
    startElectron(RENDERER_URL)

    mainWatcher.on("event", (event) => {
        if (event.code !== "BUNDLE_END") {
            return
        }

        if (electronProcess && electronProcess.kill) {
            manualRestart = true
            process.kill(electronProcess.pid)
            electronProcess = null
            startElectron(RENDERER_URL)
            setTimeout(() => {
                manualRestart = false
            }, 5000)
        }

    })
}

start()