exports.fixStringForPath = (fileName) =>{
    if(fileName===null||!fileName){
        return fileName;
    }
    let newFileName = fileName;
    newFileName = newFileName.replace(/\?|\!/g, "");
    newFileName = newFileName.replace(/\"/g, "");
    newFileName = newFileName.replace(/é/g, "e");
    console.log('[db controller] fixStringForPath: newFileName',newFileName);
    return newFileName;
}