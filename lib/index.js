'use strict';
const util = require("util");
const debugLog = util.debuglog('gitci');
const execCommand = require("child_process").exec;
const baseAction = require("gitci-baseaction");
const path = require('path');

/**
 * The Command Object that execute a command.
 * @param  {Object} commands Create a Commands instance to be used on the deployment.
 * @returns {Commands} The command object that will be executed.
 */
var Commands = function (action) {
    Commands.super_.call(this, action);

    this._commandResults = [];
}
util.inherits(Commands, baseAction.BaseAction);

/**
 * Execute the commands passed.
 */
Commands.prototype.execute = function () {
    var self = this;
    var totalActions = this.action.length;
    var executedAction = 0;

    executeCommand(self, self.action, totalActions, executedAction);
}

function executeCommand(self, action, totalActions, executedAction) {
    var currentAction = action[executedAction];
    var commandLine = currentAction.command;
    
    if (typeof currentAction.args !== "undefined")
        commandLine += " " + currentAction.args.join(" ");

    var options = {
        cwd: path.resolve(__dirname, (typeof currentAction.basePath !== "undefined") ? currentAction.basePath : "")
    };

    var child = execCommand(commandLine, options, function (error, stdout, stderr) {
        executedAction++;
        debugLog("STDOUT => %s", stdout);
        debugLog("STDERR => %s", stderr);

        var commandResult = currentAction;
        commandResult.error = error;
        commandResult.output = stderr + stdout;

        if (error !== null) {
            console.error(util.format("Error executing command \"%s\": %s", commandLine, error));
            self.emit("actionError", commandResult);
            return;
        }

        self._commandResults.push(commandResult);

        if (executedAction < totalActions)
            executeCommand(self, action, totalActions, executedAction);
        else
            self.emit("actionSuccess", self._commandResults);
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