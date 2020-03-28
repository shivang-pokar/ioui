//require('../js/app');
require('../js/menu');

const electron = require('electron').remote;
const shellElectron = require('electron').shell;
const dialog = electron.dialog;
const { exec } = require('child_process');
const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');
var parser = new xml2js.Parser();
var xmlBuilder = new xml2js.Builder();
const shell = require('shelljs');
const shellEnv = require('shell-env');
shell.config.execPath = shellEnv.sync().PATH;
const os = require('os');
require('../js/app');
const osType = os.platform();


/* Sound */
const build = "../sound/time-is-now.mp3";

/* Var */
var electron_ = require('electron');
var currentWindow = electron_.remote.getCurrentWindow();

this.path = window.localStorage.getItem('currentProject');
shell.cd(this.path)
readXml(this.path);
this.process = undefined;

$(document).ready(() => {
    $('footer p').text(this.path)
})

/*
* Serve IONIC Project
*/
$('#serve').click(() => {
    if (this.process == undefined) {
        args('ionic serve');
    }
    else {
        const options = {
            title: 'Alert',
            message: 'Project already serve on localhost please check',
        };
        let response = dialog.showMessageBox(null, options);
    }

});


/*
* Kill Process which is running
*/

$('#killProcess').click(() => {
    if (this.process) {
        const options = {
            buttons: ['Yes, please', 'No, thanks'],
            title: 'Alert',
            message: 'You sure you want to stop localhost',
        };

        let response = dialog.showMessageBox(null, options);
        response.then(res => {
            if (res.response == 0) {
                this.process.kill();
                this.process = undefined;
                $('#host').text('')
                $('#host').attr('href', '')
            }
        });
    }
});

/* 
* Args
* Args Process
*/
function args(command) {
    let compileCount = 0;
    this.process = exec(command, { encoding: 'utf8' }, function (error, stdout, stderr) {
        if (error) {
            notification('Error', error);
            $('.terminalView .args').prepend(`<p class="error">${error}</p>`);

        }
    });
    this.hostNumber;
    this.process.stdout.on('data', (data) => {
        if (data.search('--port') > 0) {
            this.hostNumber = data.slice(43);
            document.getElementById('host').innerHTML = 'http://localhost:' + data.slice(43);
            $('#host').attr('href', 'http://localhost:' + data.slice(43))
        }
        if (this.compileCount == 0) {
            this.compileCount++;
            if (data.search('Compiled successfully') > 0) {
                notification('Build', 'Project served on ' + this.hostNumber, build)
            }
            $('.terminalView .args').prepend(`<p>${data}</p>`);
        }

    });

    this.process.stderr.on('data', (data) => {
        console.log(data)
        $('.terminalView .args').prepend(`<p>${data}</p>`);
    });

}

function argsProcess(command, processMessage) {
    this.process = exec(command, { encoding: 'utf8' }, function (error, stdout, stderr) {
        if (error) {
            notification('Error', error);
            $('.loading_default').removeClass('active');
            $('.terminalView .args').prepend(`<p class="error">${error}</p>`);

        }
        else if (stdout) {
            $('.loading_default').removeClass('active');
            processComplete(processMessage);
            readXml(this.path)
        }
        console.log(stderr)
    });
    this.process.stdout.on('data', (data) => {
        console.log(data)
        $('.terminalView .args').prepend(`<p>${data}</p>`);
    })
    this.process.stderr.on('data', (data) => {
        console.log(data)
        $('.terminalView .args').prepend(`<p>${data}</p>`);
    });
}


/* 
* Read Xml
*/

function readXml(path) {
    fs.readFile(path + '/config.xml', function (err, data) {
        parser.parseString(data, function (err, result) {
            $('header p').text(result.widget.name + "(" + result.widget.$.version + ")")
            appendPlugin(result.widget.plugin)
            $('#app_id').val(result.widget.$.id);
            $('#app_name').val(result.widget.name);
            $('#app_author').val(result.widget.author[0]._);
            $('#app_version').val(result.widget.$.version);
            $('#app_email').val(result.widget.author[0].$.email);
            $('title').text(result.widget.name);
        });
    });

    let dependencies = fs.readFileSync(path + '/package.json');
    let dependenciesJSON = JSON.parse(dependencies);
    appendNpm(dependenciesJSON.dependencies);

}


/*
* Show List of plugin
*/
function appendPlugin(pluginList) {
    $('.page-panel .right-panel .cordova_plugin ul li').remove();
    pluginList.forEach(plugin => {
        $('.page-panel .right-panel .cordova_plugin ul').append('<li> <a href="javascript:void(0)" onclick="removePlugin(`' + plugin.$.name + '`)" ><img src="../images/edit-delete-icon-png.png" alt="" /><a/>' + plugin.$.name + '(' + plugin.$.spec + ')</li>')
    })
}

function appendNpm(pluginNPM) {
    $('.page-panel .right-panel .npm_plugin ul li').remove();

    for (let plugin in pluginNPM) {
        $('.page-panel .right-panel .npm_plugin ul').append('<li> <a href="javascript:void(0)" onclick="removeNpm(`' + plugin + '`)" ><img src="../images/edit-delete-icon-png.png" alt="" /><a/>' + plugin + '(' + pluginNPM[plugin] + ')</li>')
    }
}

/* 
* Remove Plugin
* Get Confirmation
*/

function removePlugin(plugin) {
    var removePlugin = getConfirmation(plugin);
    removePlugin.then(returnPromise => {
        if (returnPromise) {
            argsProcess(`ionic cordova plugin remove ${plugin}`, `${plugin} removed`);
            $('.loading_default').addClass('active');
        }
    });
}

function removeNpm(plugin) {
    var removeNpm = getConfirmation(plugin)
    removeNpm.then(returnPromise => {
        if (returnPromise) {
            argsProcess(`npm uninstall ${plugin}`, `${plugin} removed`);
            $('.loading_default').addClass('active');
        }
    });
}

function getConfirmation(plugin) {
    const options = {
        buttons: ['Yes, please', 'No, thanks'],
        title: 'Alert',
        message: 'You sure you want to delete ' + plugin,
    };

    var returnGet;
    var response = dialog.showMessageBox(null, options);
    return returnGet = response.then(res => {
        if (res.response == 0) {
            return true;
        }
        else {
            return false;
        }
    });
}


/*
* Notification
*/
function notification(title, body, sound) {
    const notificationSound = new Audio(sound)
    notificationSound.play();
    let notificationTrigger = new Notification(title, {
        body: body,
        sound: null,
        silent: true,
    });

    setTimeout(() => {
        notificationTrigger.close()
    }, 5000)
}

/*
* Open Project in browser
*/
$('#host').click(function (event) {
    event.preventDefault();
    shellElectron.openExternal($(this).text());
});


/* 
* Open Plugin Popup
* Install Plugin
*/


$('#installPlugin').click(function () {
    $('#plugin').addClass('active');
});
$('.close').click(function () {
    $('.overlay_popup').removeClass('active');
});

function installPlugin() {
    const npmCommand = $('#npmCommand').val();
    const cordovaCommand = $('#cordovaCommand').val();
    if (npmCommand) {
        argsProcess(`npm i ${npmCommand}`, `${npmCommand} installed`);
        $('.loading_default').addClass('active');
        $('#plugin').removeClass('active');
    }
    if (cordovaCommand) {
        argsProcess(`ionic cordova plugin add ${cordovaCommand}`, `${cordovaCommand} installed`);
        $('.loading_default').addClass('active');
        $('#plugin').removeClass('active');
    }
}

/* 
* Plugin Notification Managment
*/

function processComplete(processMessage) {
    if (processMessage) {
        notification('Process', processMessage, '');
    }
}

/* 
* App Detail Popup
*/

$('#installWidgets').click(() => {
    $('#appDetail').addClass('active');
    $('#app_id').focus();
});

$(document).on('keyup', function (e) {
    if (e.keyCode == 13 && $('#appDetail').hasClass('active')) {
        updateChnage();
    }
    if (e.keyCode == 27 && $('.overlay_popup').hasClass('active')) {
        $('.overlay_popup').removeClass('active');
    }
});

function updateChnage() {
    fs.readFile(this.path + '/config.xml', function (err, data) {
        parser.parseString(data, function (err, result) {
            if (err) {

            }
            else {
                result.widget.$.id = ["" + $('#app_id').val() + ""];
                result.widget.name = ["" + $('#app_name').val() + ""];
                var obj = { $: { email: $('#app_email').val(), href: result.widget.author[0].$.href }, _: $('#app_author').val() };
                result.widget.author = obj;
                result.widget.$.version = ["" + $('#app_version').val() + ""];
                var xml = xmlBuilder.buildObject(result);
                fs.writeFile(this.path + '/config.xml', xml, function (err, data) {
                    console.log(err, data)
                    if (err) {
                        $('.overlay_popup').removeClass('active');
                        let myNotification = new Notification('Config Update error', {
                            body: err
                        });
                    }
                    else {
                        $('.overlay_popup').removeClass('active');
                        let myNotification = new Notification('Config Update', {
                            body: 'Config data is Updated'
                        });
                    }
                });
            }
        });
    });
}


/*
* Add Platform
* Build Platform
*/


function argsProcessBuild(command, processMessage) {
    console.log(command);
    $('.loading_default').addClass('active');
    this.process = exec(command, function (error, stdout, stderr) {
        if (error) {
            notification('Error', error)
            $('.terminalView .args').prepend(`<p class="error">${error}</p>`);
            $('.loading_default').removeClass('active');
        }
        else if (stdout) {
            $('.loading_default').removeClass('active');
            processComplete(processMessage.charAt(0).toUpperCase() + processMessage.slice(1));

            if (command.search('android') >= 0) {
                var command_;
                if (osType == 'darwin') {
                    command_ = `open platforms/android/app/build/outputs/apk/debug`;
                }
                else {
                    command_ = `Explorer platforms/android/app/build/outputs/apk/debug`;
                }

                var message = '';
                argsProcess(command_, message);
            }
        }
    });
    this.process.stdout.on('data', (data) => {
        $('.terminalView .args').prepend(`<p>${data}</p>`);
    })
    this.process.stderr.on('data', (data) => {
        $('.terminalView .args').prepend(`<p>${data}</p>`);
    })
}

function buildPlatform(Platform) {
    var processMessage = Platform + " Build Completed";
    const COMMAND = `ionic cordova build ${Platform}`;
    argsProcessBuild(COMMAND, processMessage)
}

function platformAdd(Platform) {
    var processMessage = Platform + " added Completed";
    const COMMAND = `ionic cordova platform add ${Platform}`;
    argsProcessBuild(COMMAND, processMessage)
}

function platformRemove(Platform) {
    var processMessage = Platform + " removed Completed";
    const COMMAND = `ionic cordova platform rm ${Platform}`;
    argsProcessBuild(COMMAND, processMessage)
}


/* Create */
this.selectedGenrateType = undefined;
const createFeature = (genrate) => {
    $('#genratePopup .body_section .header_part span').text(genrate.capitalize());
    $('#genratePopup').addClass('active');
    this.selectedGenrateType = genrate;
    console.log(this.selectedGenrateType);
}

const completeGenrate = () => {
    var command = `ionic generate ${this.selectedGenrateType} ${$('#padnAndName').val()}`;
    var message = `${this.selectedGenrateType} is generated`;
    $('#loading_default').removeClass('active');
    $('#genratePopup').removeClass('active');
    argsProcess(command, message);
}

const resourcesPopupOpen = () => {
    var command = `ionic cordova resources`;
    var message = `Resources is generated`;
    argsProcess(command, message);
}


/* Open Project Folder  */
const openProjectFolder = () => {
    var command;
    if (osType == 'darwin') {
        command = `open .`;
    }
    else {
        command = `Explorer .`;
    }

    var message = '';
    argsProcess(command, message);
}

/* Simulater */

const simulator = (platform) => {
    var command = `ionic cordova emulate ${platform}`;
    argsProcess(command, '');
}


$(document).on('click', '#terminal', function () {
    $('.terminalView').addClass('active');
})
$(document).on('click', '#terminalClose', function () {
    $('.terminalView').removeClass('active');
});

$(document).on('click', '#terminalClean', function () {
    $('.terminalView .args p').remove();
});



/* Open New Project */

const openProject = (path) => {

    if (this.process) {
        this.process.kill();
        this.process = undefined;
        $('#host').text('')
        $('#host').attr('href', '');
    }
    window.localStorage.setItem('currentProject', path);
    currentWindow.reload()

}