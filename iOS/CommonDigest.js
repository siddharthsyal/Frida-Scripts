//Source : https://opensource.apple.com/source/CommonCrypto/CommonCrypto-60165/include/CommonDigest.h.auto.html
if (ObjC.available) {

    ///*****Variables for MD5*************///
    var options_MD5 = {};
    var dataOut_MD5;
    var MD5_Digest_Len = 16;
    ///**************************************///

    ///*****Variables for SHA1*************///
    var options_SHA1 = {};
    var dataOut_SHA1;
    var SHA1_Digest_Len = 20;
    ///**************************************///

    ///*****Variables for SHA224*************///
    var options_SHA224 = {};
    var dataOut_SHA224;
    var SHA224_Digest_Len = 28;
    ///**************************************///

    ///*****Variables for SHA256*************///
    var options_SHA256 = {};
    var dataOut_SHA256;
    var SHA256_Digest_Len = 32;
    ///**************************************///

    Interceptor.attach(Module.getExportByName(null, "CC_MD5"), {
        onEnter: function (args){
            var dataIN = new NativePointer(args[0])
            dataOut_MD5 = new NativePointer(args[2])
            options_MD5["Function Name"] = "MD5"
            options_MD5["Length of Data In"] = args[1].toInt32();
            options_MD5["Data In [BASE64]"] = base64ArrayBuffer(dataIN.readByteArray(options_MD5["Length of Data In"]));
        },
        onLeave: function (retval) {
            options_MD5["Data Out [BASE64]"] = base64ArrayBuffer(dataOut_MD5.readByteArray(MD5_Digest_Len));
            print(options_MD5);
        }
    });

    Interceptor.attach(Module.getExportByName(null, "CC_SHA1"), {
        onEnter: function (args){
            var dataIN = new NativePointer(args[0])
            dataOut_SHA1 = new NativePointer(args[2])
            options_SHA1["Function Name"] = "SHA1"
            options_SHA1["Length of Data In"] = args[1].toInt32();
            options_SHA1["Data In [BASE64]"] = base64ArrayBuffer(dataIN.readByteArray(options_SHA1["Length of Data In"]));
        },
        onLeave: function (retval) {
            options_SHA1["Data Out [BASE64]"] = base64ArrayBuffer(dataOut_SHA1.readByteArray(SHA1_Digest_Len));
            print(options_SHA1);
        }
    });

    Interceptor.attach(Module.getExportByName(null, "CC_SHA224"), {
        onEnter: function (args){
            var dataIN = new NativePointer(args[0])
            dataOut_SHA224 = new NativePointer(args[2])
            options_SHA224["Function Name"] = "SHA224"
            options_SHA224["Length of Data In"] = args[1].toInt32();
            options_SHA224["Data In [BASE64]"] = base64ArrayBuffer(dataIN.readByteArray(options_SHA224["Length of Data In"]));
        },
        onLeave: function (retval) {
            options_SHA224["Data Out [BASE64]"] = base64ArrayBuffer(dataOut_SHA224.readByteArray(SHA224_Digest_Len));
            print(options_SHA224);
        }
    });

    Interceptor.attach(Module.getExportByName(null, "CC_SHA256"), {
        onEnter: function (args){
            var dataIN = new NativePointer(args[0])
            dataOut_SHA256 = new NativePointer(args[2])
            options_SHA256["Function Name"] = "SHA256"
            options_SHA256["Length of Data In"] = args[1].toInt32();
            options_SHA256["Data In [BASE64]"] = base64ArrayBuffer(dataIN.readByteArray(options_SHA256["Length of Data In"]));
        },
        onLeave: function (retval) {
            options_SHA256["Data Out [BASE64]"] = base64ArrayBuffer(dataOut_SHA256.readByteArray(SHA256_Digest_Len));
            print(options_SHA256);
        }
    });
}else{
    console.log("Objective C not available");
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