export const getFandomsNumbers = (data) =>{
    return new Promise(function(resolve, reject) {
        console.log('getFandomsNumbers()');
        let dataObj = [];
        let fandomsArr = []
        data.FanficList.map(fic=>{
            if(fandomsArr.includes(fic.FandomName)){
                let fanfic = dataObj.find(f => {
                    return f.name === fic.FandomName;
                });
                fic.Status==='Finished' && fanfic.Finished++;
                fic.Status==='In Progress' && fanfic['In Progress']++;
                fic.Favorite && fanfic.Favorite++;
                fic.Ignore && fanfic.Ignored++;
                fic.Follow && fanfic.Follow++;
                // fanfic.Total++
                // (fic.Status==='Finished'||fic.Status==='In Progress') && fanfic.TotalRead++;
            }else{
                fandomsArr.push(fic.FandomName);
    
                dataObj.push({
                    name:     fic.FandomName,
                    // Total: 1,
                    // TotalRead:      1,
                    Finished:           fic.Status==='Finished' ? 1 : 0,
                    'In Progress':     fic.Status==='In Progress' ? 1 : 0,
                    Favorite:           fic.Favorite ? 1 : 0,
                    Ignored:            fic.Ignore ? 1 : 0,
                    Follow:             fic.Follow ? 1 : 0
                })
            }
            return
        })
        console.log('fandomsArr:',fandomsArr)
        console.log('dataObj:',dataObj)
    
        resolve(dataObj);
    })

}

export const getLatestFanfic = (data,fandom) => {
    let lastFinished    = {Status:'',Date:0};
    let lastInProgress  = {Status:'',Date:0};
    let lastFavorite    = {Favorite:'',Date:0};
    let lastIgnored     = {Ignore:'',Date:0};
    let lastFollowed    = {Follow:'',Date:0};
    // return new Promise(function(resolve, reject) {
        data.FanficList.map(fic=>{
            if(fic.FandomName===fandom){
                lastFinished    =   (fic.Status!=='Finished')     ? lastFinished        : (lastFinished.Date>fic.Date)      ? lastFinished      :   fic;
                lastInProgress  =   (fic.Status!=='In Progress')  ? lastInProgress      : (lastInProgress.Date>fic.Date)    ? lastInProgress    :   fic;
                lastFavorite    =   (!fic.Favorite)               ? lastFavorite        : (lastFavorite.Date>fic.Date)      ? lastFavorite      :   fic;
                lastIgnored     =   (!fic.Ignore)                 ? lastIgnored         : (lastIgnored.Date>fic.Date)       ? lastIgnored       :   fic;
                lastFollowed    =   (!fic.Follow)                 ? lastFollowed        : (lastFollowed.Date>fic.Date)      ? lastFollowed      :   fic;
            }
            return
        })
        lastFinished    = lastFinished.Date===0     ? null : lastFinished
        lastInProgress  = lastInProgress.Date===0   ? null : lastInProgress
        lastFavorite    = lastFavorite.Date===0     ? null : lastFavorite
        lastIgnored     = lastIgnored.Date===0      ? null : lastIgnored
        lastFollowed    = lastFollowed.Date===0     ? null : lastFollowed

        return [lastFinished,lastInProgress,lastFavorite,lastIgnored,lastFollowed]
    // });
}

export const buildFanficLink = (fanfic) => {
    let url ='';
    switch (fanfic.Source) {
        case 'FF':
            url = `https://www.fanfiction.net/s/${fanfic.FanficID}`
            break;
        default:
            url = `https://archiveofourown.org/works/${fanfic.FanficID}`
            break;
    }

    return url
}