//Source : https://opensource.apple.com/source/CommonCrypto/CommonCrypto-60118.50.1/include/CommonKeyDerivation.h.auto.html

if (ObjC.available) {

    const algorithm = {
        1:"kCCPRFHmacAlgSHA1",
        2:"kCCPRFHmacAlgSHA224",
        3:"kCCPRFHmacAlgSHA256",
        4:"kCCPRFHmacAlgSHA384",
        5:"kCCPRFHmacAlgSHA512",
    }

    var version = {
        2 : "kCCPBKDF2 "
    }

    ///*****Variables for CCKeyDerivationPBKDF*************///
    var options_CCKeyDerivationPBKDF = {};
    var deriverKey_CCKeyDerivationPBKDF;
    ///**************************************///

    Interceptor.attach(Module.getExportByName(null, "CCKeyDerivationPBKDF"), {
        onEnter: function (args) {
            var password = new NativePointer(args[1]);
            var salt = new NativePointer(args[3]);
            deriverKey_CCKeyDerivationPBKDF = new NativePointer(args[7]);
            options_CCKeyDerivationPBKDF["Function"]="CCKeyDerivationPBKDF";
            options_CCKeyDerivationPBKDF["Version"]=version[args[0].toInt32()];
            options_CCKeyDerivationPBKDF["Algorithm"]=algorithm[args[5].toInt32()];
            options_CCKeyDerivationPBKDF["Password Length"]=args[2].toInt32();
            options_CCKeyDerivationPBKDF["Password [Base64]"]=base64ArrayBuffer(password.readByteArray(args[2].toInt32()));
            options_CCKeyDerivationPBKDF["Salt Length"]= args[4].toInt32();
            options_CCKeyDerivationPBKDF["Rounds"]=args[6].toInt32();
            options_CCKeyDerivationPBKDF["Salt [Base64]"]=base64ArrayBuffer(salt.readByteArray(args[4].toInt32()));
            options_CCKeyDerivationPBKDF["Key Length"]=args[8].toInt32();
        },
        onLeave: function (retval) {
            options_CCKeyDerivationPBKDF["Key [Base64]"] = base64ArrayBuffer(deriverKey_CCKeyDerivationPBKDF.readByteArray(options_CCKeyDerivationPBKDF["Key Length"]));
            print(options_CCKeyDerivationPBKDF);
    }
    });
}else{
    console.log("Objective C not supported");
}

function print(data){
    console.log("\n*****************************************************************");
    for (var args in data){
        console.log(args+" = "+data[args]);
    }
    console.log("*****************************************************************");
    return
}

//Source: https://gist.github.com/jonleighton/958841
function base64ArrayBuffer(arrayBuffer) {
    var base64    = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    var bytes         = new Uint8Array(arrayBuffer)
    var byteLength    = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength    = byteLength - byteRemainder
    var a, b, c, d
    var chunk
    for (var i = 0; i < mainLength; i = i + 3) {
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]
        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1
        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }
    return base64
}