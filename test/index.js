'use strict';
const commandsModule = require("../lib/index.js");

var testAction = [
    {
        "command": "cd",
        "basePath": "..",
        "args": [
            "\\"
        ]
    }
];

console.log("Starting action testing.");
try {
    var action = new commandsModule.Commands(testAction);

    action.on("actionSuccess", function () {
        console.assert(true, "Action tested successfuly");
        console.log("Action tested successfuly");
        process.exit(0);
    });

    action.on("actionError", function (error) {
        console.assert(false, error);
        process.abort();
    });

    action.execute();
} catch (error) {
    console.assert(false, "Erro testing action: %s", JSON.stringify(error));
    process.abort();
}