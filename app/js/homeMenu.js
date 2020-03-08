const { app, Menu } = require('electron');
const path = require('path');
const openAboutWindow = require('about-window').default;
const CONFIG = require('./config');
const template = [];
if (!CONFIG.PRODUCTION) {
    template.unshift({
        label: 'View',
        submenu: [
            {
                label: 'About IOUI',
                click: () =>
                    openAboutWindow({
                        icon_path: path.join(__dirname.replace('app/js', ''), '/app/images/ioui.png'),
                        copyright: 'Copyright (c) 2020 Smart Coder Hub',
                        package_json_dir: __dirname.replace('app/js', ''),
                        show_close_button: 'Close',
                    }),
            },
            {
                label: 'Quit',
                click() {
                    app.quit();
                },
                accelerator: 'CmdOrCtrl+Q'
            },
            {
                role: 'reload'
            },
            {
                role: 'copy'
            },
            {
                role: 'cut'
            },
            {
                role: 'paste'
            },
            {
                role: 'selectAll'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    })
}
else {
    template.unshift({
        label: 'View',
        submenu: [
            {
                label: 'About IOUI',
                click: () =>
                    openAboutWindow({
                        icon_path: path.join(__dirname.replace('app/js', ''), '/app/images/ioui.png'),
                        copyright: 'Copyright (c) 2020 Smart Coder Hub',
                        package_json_dir: __dirname.replace('app/js', ''),
                        show_close_button: 'Close',
                    }),
            },
            {
                role: 'copy'
            },
            {
                role: 'cut'
            },
            {
                role: 'paste'
            },
            {
                role: 'selectAll'
            },
            {
                label: 'Quit',
                click() {
                    app.quit();
                },
                accelerator: 'CmdOrCtrl+Q'
            }
        ]
    })
}
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)