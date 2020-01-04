exports.fixStringForPath = (fileName) =>{
    console.log('[db controller] fixStringForPath',fileName);
    fileName = fileName.replace(/\?|\!/g, "");
    fileName = fileName.replace(/é/g, "e");
    console.log('new fileName:',fileName);
    return fileName;
}