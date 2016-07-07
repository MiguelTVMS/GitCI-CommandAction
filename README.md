# GitCI-CommandAction
CLI command execution support for GitCI

### Description
Action responsible the running CLI commands on GitCI. Know more about GitCI visiting:
GitHub: https://github.com/jmtvms/GitCI
NPM: https://www.npmjs.com/package/gitci

### Status
Latest Version: [![npm version](https://badge.fury.io/js/gitci-commandaction.svg)](https://badge.fury.io/js/gitci-commandaction)

| Branch   | Build status |
|----------|:------------:|
| master   | [![Build Status](https://travis-ci.org/jmtvms/GitCI-CommandAction.svg?branch=master)](https://travis-ci.org/jmtvms/GitCI-CommandAction)  |
| develop  | [![Build Status](https://travis-ci.org/jmtvms/GitCI-CommandAction.svg?branch=develop)](https://travis-ci.org/jmtvms/GitCI-CommandAction)  |

### Configuration examples
This configuration can be used on _prepublish_, _publish_, _postpublish_ and _test_ action types.

```javascript
{
    "name": "Exammple config",
    "scripts": [
        {
            "type": "prepublish",
            "actions": [
                {
                    "commands": [
                        {
                            "command": "nginx",
                            "args": [
                                "-d",
                                "stop"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "postpublish",
            "actions": [
                {
                    "commands":[
                        {
                            "command": "nginx",
                            "args": [
                                "-d",
                                "start"
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```