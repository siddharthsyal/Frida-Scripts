if(ObjC.available) {
    var hook = ObjC.classes.LAContext["- evaluatePolicy:localizedReason:reply:"];
    Interceptor.attach(hook.implementation, {
        onEnter: function(args) {
            send("Hooking Touch Id..")
            var block = new ObjC.Block(args[4]);
            const appCallback = block.implementation;
            block.implementation = function (error, value)  {
                const result = appCallback(1, null);
                return result;
            };
        },
    });
} else {
    console.log("Objective-C Runtime is not available!");
}