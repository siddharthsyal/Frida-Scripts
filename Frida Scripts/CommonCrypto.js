//iOS crypto lib : https://opensource.apple.com/source/CommonCrypto/CommonCrypto-60061/include/CommonCryptor.h.auto.html
if (ObjC.available) {

///**********************[CONSTANTS]************************************///
    const algorithm = [
        "kCCAlgorithmAES128 or kCCAlgorithmAES",
        "kCCAlgorithmDES",
        "kCCAlgorithm3DES",
        "kCCAlgorithmCAST",
        "kCCAlgorithmRC4",
        "kCCAlgorithmRC2",
        "kCCAlgorithmBlowfish",
    ]

    const operation =  [
        "kCCEncrypt",
        "kCCDecrypt",
    ]

    const CCOptions = [
        "kCCOptionPKCS7Padding",
        "kCCOptionECBMode",
    ]

    const keySize = {
            16 : "kCCKeySizeAES128 or kCCKeySizeMaxCAST",
            24:"kCCKeySizeAES192 or kCCKeySize3DES",
            32:"kCCKeySizeAES256",
            8:"kCCKeySizeDES or kCCKeySizeMinBlowfish",
            5:"kCCKeySizeMinCAST",
            1:"kCCKeySizeMinRC4 or kCCKeySizeMinRC2",
            15:"kCCKeySizeMaxRC4",
            128:"kCCKeySizeMaxRC2",
            56:"kCCKeySizeMaxBlowfish",
    }

    const padding = {
        1: "kCCOptionPKCS7Padding",
        2: "kCCOptionECBMode",
    }

    ///*****Variables for CCCryptorUpdate*****///
    var options_CCCryptorUpdate = {};
    var dataOut_CCCryptorUpdate ;
    ///**************************************///

    ///*****Variables for CCCrypt*************///
    var options_CCCrypt = {};
    var dataOut_CCCrypt ;
    ///**************************************///


///**********************[ENCRYPTION OPERATIONS]************************************///
    Interceptor.attach(Module.getExportByName(null, "CCCryptorCreate"), {
        onEnter: function (args){
            var options = {};
            var key = new NativePointer(args[3]);
            var IV = new NativePointer(args[5]);
            options["Method Name"]="CCCryptorCreate";
            options["Operation"]=operation[args[0].toInt32()];
            options["Algorithm"]=algorithm[args[1].toInt32()];
            options["Key"]= key.readPointer();
            options["KeyLength"] = args[4].toInt32();
            options["KeyType"] = keySize[options["KeyLength"]];
            if (!(IV.equals(0x0))){//IV is optional
                options["IV"]=IV.readPointer();
            }
            print(options);
        }
    });
    Interceptor.attach(Module.getExportByName(null, "CCCryptorCreateFromData"), {
        onEnter: function (args){
            var options = {};
            var key = new NativePointer(args[3]);
            var iv = new NativePointer(args[5]);
            var data = new NativePointer(args[6])
            options["Method Name"]="CCCryptorCreateFromData";
            options["Operation"]=operation[args[0].toInt32()];
            options["Algorithm"]=algorithm[args[1].toInt32()];
            options["Padding"]=padding[args[2].toInt32()];
            options["Key"]= key.readPointer();
            options["KeyLength"] = args[4].toInt32();
            options["KeyType"] = keySize[options["KeyLength"]];
            options["IV"]=iv.readPointer();
            options["Data"]=data.readPointer();
            options["Data Length"]= args[7].toInt32();
            print(options);
        }
    });

    Interceptor.attach(Module.getExportByName(null, "CCCryptorUpdate"), {
        onEnter: function (args){
            var dataIN = new NativePointer(args[1])
            var dataOut = new NativePointer(args[3])
            dataOut_CCCryptorUpdate = new NativePointer(args[3])
            options_CCCryptorUpdate["Method Name"]="CCCryptorUpdate";
            options_CCCryptorUpdate["Length for Data In"]=args[2].toInt32();
            options_CCCryptorUpdate["Data In [Hex]"]=hexEncode(dataIN.readByteArray(options_CCCryptorUpdate["Length for Data In"]));
            options_CCCryptorUpdate["Length for Data Out"] = args[4].toInt32();
            options_CCCryptorUpdate["Length for Data Out written"] = args[5].toInt32();
        },
        onLeave: function (retval) {
            options_CCCryptorUpdate["Data Out [Hex]"] = hexEncode(dataOut_CCCryptorUpdate.readByteArray(options_CCCryptorUpdate["Length for Data Out"]));
            print(options_CCCryptorUpdate)
        }
    });

    Interceptor.attach(Module.getExportByName(null, "CCCrypt"), {
        onEnter: function (args){
            var key = new NativePointer(args[3]);
            var IV = new NativePointer(args[5]);
            var dataIN = new NativePointer(args[6])
            dataOut_CCCrypt = new NativePointer(args[8]);
            options_CCCrypt["Method Name"]="CCCrypt";
            options_CCCrypt["Operation"]=operation[args[0].toInt32()];
            options_CCCrypt["Algorithm"]=algorithm[args[1].toInt32()];
            options_CCCrypt["Padding"]=padding[args[2].toInt32()];
            options_CCCrypt["Key"]= key.readPointer();
            options_CCCrypt["KeyLength"] = args[4].toInt32();
            options_CCCrypt["KeyType"] = keySize[options_CCCrypt["KeyLength"]];
            if (!(IV.equals(0x0))){//IV is optional
                options_CCCrypt["IV"]=IV.readPointer();
            }
            options_CCCrypt["Length for Data In"]=args[7].toInt32();
            options_CCCrypt["Data In [Hex]"]=hexEncode(dataIN.readByteArray(options_CCCrypt["Length for Data In"]));
            options_CCCrypt["Length for Data Out"] = args[9].toInt32();
        },
        onLeave: function (retval) {
            options_CCCrypt["Data Out [Hex]"] = hexEncode(dataOut_CCCrypt.readByteArray(options_CCCrypt["Length for Data Out"]));
            print(options_CCCrypt)
        }
    });

    Interceptor.attach(Module.getExportByName(null, "CCCryptorFinal"), {
        onEnter: function (args){
            var options_CCCryptorFinal= {};
          //  var dataOut_CCCryptorFinal = new NativePointer(args[1])// Result is written here. Allocated by caller.
            options_CCCryptorFinal["Method Name"]="CCCryptorFinal";
            options_CCCryptorFinal["Length for Data out"]=args[2].toInt32();//The size of the dataOut buffer in bytes.
            options_CCCryptorFinal["Length for Data Out written"] = args[3].toInt32();//On successful return, the number of byteswritten to dataOut.
        }
    });
}else{
    console.log("Objective C not available");
}

function hexEncode(data){
    var hexString = "";
    var newData = new Uint8Array(data);
    for (var i=0;i<newData.length;i++){
        hexString += newData[i].toString(16);
    }
    return hexString;
}


function print(data){
    console.log("\n*****************************************************************");
    for (var args in data){
        console.log(args+" = "+data[args]);
    }
    console.log("*****************************************************************");
    return
};
