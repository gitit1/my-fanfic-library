exports.createAO3Url =  async (searchKeys) => {  
    searchKeys = searchKeys.replace(/ /g,'%20');
    searchKeys = searchKeys.replace(/\//g,'*s*');
    searchKeys = searchKeys.replace(/í/g, "&iacute;");
    searchKeys = searchKeys.replace(/&/g, "*a*");
    url = `https://archiveofourown.org/tags/${searchKeys}/works`;
    return url
}