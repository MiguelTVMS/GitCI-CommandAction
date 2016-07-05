'use strict';
const util = require("util");
const debugLog = util.debuglog('gitci');
const execFile = require("child_process").execFile;
const baseAction = require("gitci-baseaction");
const path = require('path');

/**
 * The Command Object that execute a command.
 * @param  {Object} commands Create a Commands instance to be used on the deployment.
 * @returns {Commands} The command object that will be executed.
 */
var Commands = function (action) {
    this._processes = [];
    Commands.super_.call(this, action);
}
util.inherits(Commands, baseAction.BaseAction);

/**
 * Execute the commands passed.
 */
Commands.prototype.execute = function () {
    var self = this;
    var commands = this.action;

    commands.forEach(function (element, index, array) {

        var isWin = /^win/.test(process.platform);

        if (isWin)
            modifyCommadForWindows(element);

        var childProcessOptions = {
            //encoding: 'utf8',
            //timeout: 0,
            //maxBuffer: 200 * 1024,
            //killSignal: 'SIGTERM',
            env: process.env,
            cwd: path.resolve(__dirname, element.basePath),
            windowsVerbatimArguments: isWin
        }

        var child = execFile(element.command, element.args, childProcessOptions, function (error, stdout, stderr) {
            debugLog("STDOUT => %s", stdout);
            debugLog("STDERR => %s", stderr);

            var commandResult = element;
            commandResult.error = error;
            commandResult.output = stderr + stdout;

            if (error !== null) {
                var errorMessage = util.format("Error executing command: \"%s", element.command);
                if (typeof element.args !== "undefided" && element.args.length > 0)
                    errorMessage += " " + element.args.join(" ");
                errorMessage += "\" %s";
                console.error(errorMessage, error);
                self.emit("actionError", commandResult);
                return;
            }

            self.emit("actionSuccess", commandResult);
        });
        monitorChildProcess(child);
        self._processes.push(child);
    });
}

function modifyCommadForWindows(action) {
    if (typeof action.args === "undefided")
        action.args = [];

    action.args.splice(0, 0, action.command);

    action.args.splice(0, 0, "/C");

    action.command = "cmd";
}

/**
 * Monitor the child process
 * @param  {Object} child Child process that will be monitored
 */
function monitorChildProcess(child) {

    child.stdin.on('data', function (data) {
        debugLog("STDIN => %s", data);
    });

    child.stdout.on('data', function (data) {
        debugLog("STDOUT => %s", data);
    });

    child.stderr.on('data', function (data) {
        debugLog("STDERR => %s", data);
    });
}

/**
 * Validade the command is it's formatted correctly.
 * @param  {Object} commands Commands to the validaded.
 * @return {boolean} If the commands are valid.
 */
Commands.prototype.validade = function () {
    var valid = true;
    var commands = this.action;

    if (!Array.isArray(commands) && commands.lenght <= 0)
        return valid = true;

    for (var index = 0; index < commands.length; index++) {
        var element = commands[index];

        if (typeof (element.command) === "undefided") {
            valid = false;
            break;
        }

        if (typeof (element.basePath) === "undefided") {
            valid = false;
            break;
        }

        if (typeof (element.args) !== "undefined" && Array.isArray(element.args)) {
            for (var indexArgs = 0; indexArgs < element.args.length; indexArgs++) {
                var arg = element.args[indexArgs];
                if (typeof (arg) !== "string") {
                    valid = false;
                    break;
                }
            }

            if (valid == false)
                break;
        }

    }

    return valid;
}

exports = module.exports = {
    Commands: Commands
}