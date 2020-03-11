const { app, Menu } = require('electron').remote;
const path = require('path');
const openAboutWindow = require('about-window').default;
const CONFIG = require('./config');
const template = [
    {
        label: 'File', submenu: [
            {
                label: 'Close Window',
                click() {
                    fileFeature('close');
                },
                accelerator: 'CmdOrCtrl+W'
            },
        ]
    },
    {
        label: 'Edit', submenu: [
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
        ]
    }
];

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
                label: 'Quit',
                click() {
                    app.quit();
                },
                accelerator: 'CmdOrCtrl+Q'
            }
        ]
    })
}
let menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu);


/* app.on('browser-window-focus', function (event, hasVisibleWindows) {
    let url = event.sender.getURL();
    if (url.indexOf('index.html') > 1) {
        let menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu);
    }
}) */