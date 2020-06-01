exports.fixStringForPath = (fileName) =>{
    if(fileName===null||!fileName){
        return fileName;
    }
    let newFileName = fileName;
    newFileName = newFileName.replace(/\?/g, "");
    newFileName = newFileName.replace(/\!/g, "");
    newFileName = newFileName.replace(/\"/g, "");
    newFileName = newFileName.replace(/\'/g, "");
    newFileName = newFileName.replace(/\//g, "-");
    newFileName = newFileName.replace(/\#/g, "");
    newFileName = newFileName.replace(/\:/g, "");
    newFileName = newFileName.replace(/\❤️/g, "");
    newFileName = newFileName.replace(/\|/g, "_");
    newFileName = newFileName.replace(/é/g, "e");
    newFileName = newFileName.replace(/%22/g, "");
    if(newFileName.includes('(') && !newFileName.includes(')')){
        newFileName = newFileName.replace(/\(/g, "");
    } else if(newFileName.includes(')') && !newFileName.includes('(')){
        newFileName = newFileName.replace(/\)/g, "");
    }
    console.log('[db controller] fixStringForPath: newFileName',newFileName);
    return newFileName;
}