const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

let mainWin;
let configWin;

// Ventana principal
function createMain() {
  mainWin = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWin.loadFile("index.html");
  mainWin.on("closed", () => mainWin = null);
}

// Ventana configuración
function createConfigWindow() {
  if (configWin) return;
  configWin = new BrowserWindow({
    width: 600,
    height: 500,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  configWin.loadFile("config.html");
  configWin.on("closed", () => configWin = null);
}

// IPC
ipcMain.handle("open-config", () => createConfigWindow());

ipcMain.handle("get-config", () => {
  try {
    return JSON.parse(fs.readFileSync("config.json", "utf-8"));
  } catch {
    return {};
  }
});

ipcMain.handle("save-config", (event, data) => {
  fs.writeFileSync("config.json", JSON.stringify(data, null, 2));
  if (configWin) configWin.close();
  return { success: true };
});

ipcMain.handle("send-email", async (event, { smtp, to, msg, attachments }) => {
  try {
    const [user, pass, host, port] = smtp.split(";");
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: port == 465,
      auth: { user, pass }
    });

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;padding:15px;color:#333;">
        ${msg}
        <hr style="margin-top:20px;">
        <p style="text-align:center;font-size:12px;color:gray;">
          ⚙️ Enviado automáticamente por <b>KanaTransfer Tools 2025</b>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: user,
      to,
      subject: "PC Info",
      html: htmlBody,
      attachments: attachments || []   // 👈 aquí entra la imagen con cid
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});




ipcMain.handle("close-app", () => app.quit());

// App ready
app.whenReady().then(createMain);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length===0) createMain(); });

const { execSync } = require("child_process");

ipcMain.handle("get-pcinfo", () => {
  try {
    const hostname = execSync('wmic computersystem get name').toString().split('\n')[1].trim();
    const marca = execSync('wmic computersystem get manufacturer').toString().split('\n')[1].trim();
    const modelo = execSync('wmic computersystem get model').toString().split('\n')[1].trim();
    const serie = execSync('wmic bios get serialnumber').toString().split('\n')[1].trim();
    const usuario = execSync('whoami').toString().trim();
    const dominio = execSync('wmic computersystem get domain').toString().split('\n')[1].trim();
    return { hostname, marca, modelo, serie, usuario, dominio };
  } catch (err) {
    return { error: err.message };
  }
});
