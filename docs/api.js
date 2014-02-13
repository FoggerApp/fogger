YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "GruntConfiguration",
        "navigator"
    ],
    "modules": [
        "Grunt",
        "fogger"
    ],
    "allModules": [
        {
            "displayName": "fogger",
            "name": "fogger"
        },
        {
            "displayName": "Grunt",
            "name": "Grunt",
            "description": "This Gruntfile specifies commands for our fogger project.\n\nRunning jasmine tests\n---------------------\nCurrent the jasmine test command is not working because\nour application runs on web2py. This would require a complex\nheadless environment that we might implement for the next iteration.\nFor now, tests can be run by navigating to a page and adding \"test=1\"\nas a GET URL parameter."
        }
    ]
} };
});