exports.getFixedUrl = url =>{
    let newUrl=  url.replace(/(.*?\/s\/[0-9].*?)\/[0-9]\/.*||(.*?\/s\/.*?[0-9]).*/gm,'$1') 
    if(newUrl.endsWith("/")){
        return newUrl;
    }else{
        return newUrl+'/';
    }
}

//fixed url with m (mobile)