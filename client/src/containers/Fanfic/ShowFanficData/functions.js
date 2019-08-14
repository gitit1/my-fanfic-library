export const greenClassesHandler = () =>{
    const   greenDiv            =   'userData_green  userData',
            greenDivOn          =   'userData_greenOn  userData'; 
            //greenIcon           =   'userData_green userData_icon',
            //greenIconOn         =   'userData_greenOn userData_icon'

//   return([greenDiv,greenDivOn,greenIcon,greenIconOn])
  return([greenDiv,greenDivOn])
}
export const redClassesHandler = () =>{
    const   redDiv              =   'userData_red  userData',
            redDivOn            =   'userData_redOn  userData';
            //redIcon             =   'userData_red userData_icon',
            //redIconOn           =   'userData_redOn userData_icon',
            //redLabel            =   'userData_red userData_iconLabel',
            //redLabelOn          =   'userData_redOn userData_iconLabel'

    // return([redDiv,redDivOn,redIcon,redIconOn,redLabel,redLabelOn])
    return([redDiv,redDivOn])
}
export const followFilter = (userData,greenClasses,MarkedAsRead,MarkAsRead) =>{
    const   isFollowed          =   (userData && userData.Follow===true) ? true : false,
            followClassDiv      =   'userData',
            // followClassDiv      =   isFollowed ? greenClasses[1] : greenClasses[0],
            //followClassIcon     =   isFollowed ? greenClasses[3] : greenClasses[2],
            //followClassLabel    =   isFollowed ? greenClasses[5] : greenClasses[4],
            //followSvgSrc        =   isFollowed ?  MarkedAsRead : MarkAsRead,
            followClick         =   userData ? userData.Follow : null;
    
    //return([followClassDiv,followClassIcon,followClassLabel,followClick,followSvgSrc,isFollowed])
    return([followClassDiv,followClick,isFollowed])
}  
export const favoriteFilter = (userData) =>{
// export const favoriteFilter = (userData,redClasses) =>{
    const   isFavorite          =   (userData && userData.Favorite===true) ? true : false, 
            favClassDiv         =   'userData',
            // favClassDiv         =   isFavorite ? redClasses[1] : redClasses[0],
            // favClassIcon        =   isFavorite ? redClasses[3] : redClasses[2],
            // favClassLabel       =   isFavorite ? redClasses[5] : redClasses[4],
            favClick            =   userData ? userData.Favorite : null;
    
    // return([favClassDiv,favClassIcon,favClassLabel,favClick])
    return([favClassDiv,favClick,isFavorite])
}           
export const finishedFilter = (userData) => {
// export const finishedFilter = (userData,greenClasses,MarkedAsRead,MarkAsRead) => {
    const   isFinished          =   (userData && userData.Status==='Finished') ? true : false,
            finishedClassDiv    =   'userData';
            //finishedClassDiv    =   isFinished ? greenClasses[1] : greenClasses[0],
            //finishedClassIcon   =   isFinished ? greenClasses[3] : greenClasses[2],
            //finishedSvgSrc      =   isFinished ?  MarkedAsRead : MarkAsRead;

    return([finishedClassDiv,isFinished])
    // return([isFinished,finishedClassDiv,finishedClassIcon,finishedSvgSrc])
}
export const inProgressFilter = (userData,greenClasses,isFinished,MarkedAsRead,MarkAsRead) => {
// export const inProgressFilter = (userData,greenClasses,isFinished,MarkedAsRead,MarkAsRead) => {
    const   isInProgress        =   (userData && userData.Status==='In Progress') ? true : false,
            inProgressClassDiv  =   'userData',
            // inProgressClassDiv  =   isInProgress ? greenClasses[1] : greenClasses[0],
            // inProgressClassIcon =   isInProgress ? greenClasses[3] : greenClasses[2],
            isDisabled          =   isFinished   ? '${inProgressClassDiv} ${classes.Disabled}' : inProgressClassDiv,
            // inProgressSvgSrc    =   isInProgress ?  MarkedAsRead : MarkAsRead,
            statusClick         =   (userData && userData.Status) ? userData.Status : null;

    return([inProgressClassDiv,isInProgress,isDisabled,statusClick])
}
export const ignoreFilter = (userData,redClasses) => {
    const   ignoreClassDiv      =   'userData',
    // const   ignoreClassDiv      =   (userData && userData.Ignore===true) ? redClasses[1] : redClasses[0],
            //ignoreClassIcon     =   (userData && userData.Ignore===true) ? redClasses[3] : redClasses[2],
            //ignoreClassLabel    =   (userData && userData.Ignore===true) ? redClasses[5] : redClasses[4],
            isIgnored        =   (userData && userData.Ignore===true) ? true : false,
            ignoreClick         =   userData ? userData.Ignore : null;

    return([ignoreClassDiv,ignoreClick,isIgnored])
    // return([ignoreClassDiv,ignoreClassIcon,ignoreClassLabel,ignoreClick])
}
export const readingListFilter = (userData)=>{
    const   inReadingList     =   (userData && (userData.ReadingList!==''||userData.ReadingList.length>0)) ? true : false;
    
    return([inReadingList])
}