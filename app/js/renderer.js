#!/usr/bin/env bash

/* 
* Js For Home Page 
*/

/* 
* Call All js 
*/

const electron = require('electron').remote
const dialog = electron.dialog;
const storage = require('electron-json-storage');
const fs = require('fs');
const xml2js = require('xml2js');
const { exec } = require('child_process');
const parser = new xml2js.Parser();
const xmlBuilder = new xml2js.Builder();
const os = require('os');
const util = require('util');
storage.setDataPath(os.tmpdir());
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
console.log(os.tmpdir());
require('../js/app');
const shell = require('shelljs');
const shellEnv = require('shell-env');
this.path;
this.newProjectPath;
this.projectName;
this.projectLiat = [];
shell.config.execPath = shellEnv.sync().PATH;


function args(command) {
    var child = exec(command, { encoding: 'utf8' }, function (error, stdout, stderr) {
        //console.log(error, stdout, stderr)
        //$('.process_poup .process_data').prepend('<p>'+error+'</p>')

    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        $('.process_poup').addClass('active')
        //$('.process_poup .process_data').prepend('<p>'+data.toString()+'</p>')
    });

    child.on('exit', () => {
        setTimeout(() => {
            let projectName = this.projectName.toLowerCase();
            projectName = projectName.replace(/ /g, '-')
            var gotoPath = this.newProjectPath + "/" + projectName;
            $('.process_poup').removeClass('active');
            gotoProject(gotoPath)
        }, 3000)
    });
}

$(document).ready(() => {
    storage.get('projects', (error, data) => {
        if (error) {
            throw error;
        }
        else {
            storage.get('projects', (error, data) => {
                if (error) {
                    throw error;
                }
                else {
                    console.log(data)
                    for (let x in data) {
                        this.projectLiat.push(data[x])
                    }
                    /*this.projectLiat.push(data)*/
                }
            });

            setTimeout(() => {
                for (var x in this.projectLiat) {
                    var html = `<div onclick="gotoProject('${this.projectLiat[x].path}')" class="list_part"><h4>${this.projectLiat[x].name}</h4><p>${this.projectLiat[x].path}</p><p></p></div>`;
                    $('.home_page .right_panel').append(html)
                    console.log(this.projectLiat[x])
                }
            }, 100)
        }
    });
});


/* Open New Project */
function openProject() {
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
        this.path = result.filePaths[0];
        fs.readFile(this.path + '/config.xml', function (err, data) {
            parser.parseString(data, function (err, result) {
                var name = util.inspect(result.widget.name[0]).replace(/'/g, '');
                this.projectLiat.push({ 'name': name, 'path': this.path })
                storage.set('projects', this.projectLiat, function (error) {
                    if (error) {
                        throw error;
                    }
                    else {
                        gotoProject(this.path);
                    }
                });
            });
        });
    });
}

/* Open Existing Project */

function gotoProject(path) {
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
    shell.cd("'" + path + "'");
    var currentWindow = remote.getCurrentWindow();
    win.loadFile('app/html/default.html');
    currentWindow.close();
}

/* Start New Project */
function startProject() {
    if ($('#project_name').val() && this.newProjectPath && $('#template').val()) {
        shell.cd(this.newProjectPath);
        this.projectName = $('#project_name').val();
        const COMMAND = "ionic start '" + this.projectName + "' " + $('#template').val() + " " + $('#options').val();
        args(COMMAND);
        console.log(COMMAND)
    }
}

function getPath() {
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
        this.newProjectPath = result.filePaths[0];
    })
}

