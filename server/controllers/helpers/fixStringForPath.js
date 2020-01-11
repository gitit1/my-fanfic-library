exports.fixStringForPath = (fileName) =>{
    if(fileName===null||!fileName){
        return fileName;
    }
    let newFileName = fileName;
    console.log('[db controller] fixStringForPath',fileName);
    newFileName = newFileName.replace(/\?|\!/g, "");
    newFileName = newFileName.replace(/é/g, "e");
    console.log('new fileName:',newFileName);
    return newFileName;
}