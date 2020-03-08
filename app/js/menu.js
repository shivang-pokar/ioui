const { app, Menu } = require('electron').remote;
const path = require('path');
const openAboutWindow = require('about-window').default;
const CONFIG = require('./config');

const template = [
    {
        label: 'Product', submenu: [

            {
                label: 'Build',
                submenu: [
                    {
                        label: 'Android',
                        click() {
                            buildPlatform('android');
                        }
                    },
                    {
                        label: 'IOS',
                        click() {
                            buildPlatform('ios')
                        }
                    }
                ]
            },
            {
                label: 'Platform Add',
                submenu: [
                    {
                        label: 'Android',
                        click() {
                            platformAdd('android');
                        }
                    },
                    {
                        label: 'IOS',
                        click() {
                            platformAdd('ios')
                        }
                    }
                ]
            },
            {
                label: 'Platform Remove',
                submenu: [
                    {
                        label: 'Android',
                        click() {
                            platformRemove('android');
                        }
                    },
                    {
                        label: 'IOS',
                        click() {
                            platformRemove('ios')
                        }
                    }
                ]
            }
        ]
    },
    {

        label: 'Generate', submenu: [
            {
                label: 'Page',
                click() {
                    createFeature('page');
                }
            },
            {
                label: 'Component',
                click() {
                    createFeature('component');
                }
            },
            {
                label: 'Directive',
                click() {
                    createFeature('directive');
                }
            },
            {
                label: 'Service',
                click() {
                    createFeature('service');
                }
            },
            {
                label: 'Pipe',
                click() {
                    createFeature('pipe');
                }
            },
            {
                label: 'Guard',
                click() {
                    createFeature('guard');
                }
            },
            {
                label: 'Class',
                click() {
                    createFeature('class');
                }
            },
            {
                label: 'Interface',
                click() {
                    createFeature('interface');
                }
            },
            {
                label: 'Enum',
                click() {
                    createFeature('enum');
                }
            },
        ]

    }
]

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