const electron = require("electron");
const {
    v4: uuidv4 
} = require('uuid');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let todayWindow;
let createWindow;
let listWindow;

let allAppointment = [];

app.on("ready", () => {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: "Rental Mobil Abadi"
    });

    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () => {

        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu);

});


const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Pesanan Customer"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", () => (listWindow = null));
};

const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Create Appointments"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("closed", () => (createWindow = null));
};

ipcMain.on("appointment:create", (event, appointment) => {
    appointment["id"] = uuidv4();
    appointment["done"] = 0;
    allAppointment.push(appointment);

    createWindow.close();

    console.log(allAppointment);
});

ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allAppointment);
});

ipcMain.on("appointment:request:today", event => {
    console.log("here2");
});

ipcMain.on("appointment:done", (event, id) => {
    console.log("here3")
});


const menuTemplate = [{
        label: "File",
        submenu: [{
                label: "Pemesanan",
                click() {
                    createWindowCreator();

                }
            },
            {
                label: "Pesanan",
                click() {
                    listWindowCreator();
                }
            },
            {
                label: "Quit",
                click() {
                    app.quit();

                }
            }
        ]
    },

    {
        label: "View",
        submenu: [{
            role: "reload"
        }, {
            role: "toggledevtools"
        }]

    }
]