const { app, Menu, electron } = require('electron').remote;
const win = require('electron').remote;
const BrowserWindow = win.BrowserWindow;
const path = require('path');
const openAboutWindow = require('about-window').default;
const CONFIG = require('./config');
const fs = require('fs');
const storage = require('electron-json-storage');
const os = require('os');
storage.setDataPath(os.tmpdir());
this.projectList;

storage.get('projects', (error, data) => {

    if (!error) {
        this.projectList = data;
        this.projectList.forEach((element, key) => {
            if (key < 3) {
                this.projectList[key].label = element.name
                this.projectList[key].click = () => openProject(this.projectList[key].path)
            }
        });
        appMenu();
    }
    else {
        appMenu();
    }
});

const appMenu = () => {

    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Close Window',
                    click() {
                        fileFeature('close');
                    },
                    accelerator: 'CmdOrCtrl+W'
                },
                {
                    label: 'Recent Project',
                    submenu: this.projectList
                }
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
        },
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
                            label: 'Android --prod',
                            click() {
                                buildPlatform('android --prod');
                            }
                        },
                        {
                            label: 'IOS',
                            click() {
                                buildPlatform('ios')
                            }
                        },
                        {
                            label: 'IOS --prod',
                            click() {
                                buildPlatform('ios --prod')
                            }
                        },
                        {
                            label: 'Browser',
                            click() {
                                buildPlatform('browser')
                            }
                        },
                        {
                            label: 'Browser --prod',
                            click() {
                                buildPlatform('browser --prod')
                            }
                        }
                    ]
                },
                {
                    label: 'Simulator',
                    submenu: [
                        {
                            label: 'Android',
                            click() {
                                simulator('android');
                            }
                        },
                        {
                            label: 'IOS',
                            click() {
                                simulator('ios')
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
                {
                    label: 'Resources',
                    click() {
                        resourcesPopupOpen();
                    }
                },
            ]
        }
    ]

    if (!CONFIG.PRODUCTION) {
        template.unshift(
            {
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
            }
        )
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


}










/* app.on('browser-window-focus', function (event, hasVisibleWindows) {
    let url = event.sender.getURL();
    if (url.indexOf('default.html') > 1) {
        let menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu);
    }
}); */

/* Menu Feature */

const fileFeature = (fileSelectedOption) => {

    /* if (fileSelectedOption == "newStart") {

        let mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            titleBarStyle: 'hiddenInset',
            'standard-window': false,
            webPreferences: {
                nodeIntegration: true
            }
        })
        mainWindow.loadFile('app/html/index.html')
    }

    if (fileSelectedOption == "open") {
        dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
            var path = result.filePaths[0];
            if (path) {
                fs.readFile(path + '/config.xml', function (err, data) {
                    parser.parseString(data, function (err, result) {
                        if (path) {
                            gotoProject(path);
                        }
                    });
                });
            }
        });
    } */

    if (fileSelectedOption == "close") {
        var currentWindow = win.getCurrentWindow();
        currentWindow.close();
    }

}

/* const gotoProject = (path) => {
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        titleBarStyle: 'hiddenInset',
        'standard-window': false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.localStorage.setItem('currentProject', path);
    win.loadFile(`app/html/default.html`);
} */