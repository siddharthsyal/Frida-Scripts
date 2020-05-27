• TouchIDBypass.js : Biometric bypass on iOS devices if local authentication framework is used.

• FileManager.js : Logs the local storage file access by an iOS application.

• PBKDF.js : Logs the input parameters, output for CommonKeyDerivation library.

• CommonCrypto.js : Logs the input parameters, output for CommonCrypto library.

• CommonDigest.js : Logs the input parameters, output for CommonDigest library.

//Usage : frida -U  -l FileManager.js -f [Bundle Identifier Here] --no-pause