if (ObjC.available) {

    /**createFileAtPath:contents:attributes:**/
    var className = "NSFileManager";
    var funcName = "- createFileAtPath:contents:attributes:";
    var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');
    Interceptor.attach(hook.implementation, {
        onEnter(args) {
            var path = new ObjC.Object(args[2]).toString();
            var data = new ObjC.Object(args[3]).toString();
            console.log("\n*****************************************************************");
            console.log("Method Name : createFileAtPath:contents:attributes:, Path = "+path+",Data = "+data);
            console.log("*****************************************************************");
        }
    });

    /**Returns a Boolean value that indicates whether a file or directory exists at a specified path.**/
    className = "NSFileManager";
    funcName = "- fileExistsAtPath:";
    hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');
    Interceptor.attach(hook.implementation, {
        onEnter(args) {
            var path = new ObjC.Object(args[2]).toString();
            console.log("\n*****************************************************************");
            console.log("Method Name : fileExistsAtPath:, Path = "+path);
        },
        onLeave: function (retval){
                console.log("Return value = "+retval.toInt32());
                console.log("*****************************************************************");
            }
    });

    /**SQLite database access**/
   Interceptor.attach(Module.getExportByName(null, "sqlite3_open_v2"), {
        onEnter: function (args){
            var path = new NativePointer(args[0]);
            console.log("\n*****************************************************************");
            console.log("Method Name : sqlite3_open_v2:, Path = "+path.readUtf8String());
            console.log("*****************************************************************");
        }
    });

}else{
    console.log("Objective C not supported");
}