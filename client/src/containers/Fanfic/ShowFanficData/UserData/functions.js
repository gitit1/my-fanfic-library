export const greenClassesHandler = () =>{
    const   greenDiv            =   'userData_green  userData',
            greenDivOn          =   'userData_greenOn  userData'; 

  return([greenDiv,greenDivOn])
}
export const redClassesHandler = () =>{
    const   redDiv              =   'userData_red  userData',
            redDivOn            =   'userData_redOn  userData';

    return([redDiv,redDivOn])
}
export const followFilter = (userData) =>{
    const   isFollowed          =   (userData && userData.Follow===true) ? true : false,
            followClassDiv      =   'userData',
            followClick         =   userData ? userData.Follow : null;

    return([followClassDiv,followClick,isFollowed])
}  
export const favoriteFilter = (userData) =>{
    const   isFavorite          =   (userData && userData.Favorite===true) ? true : false, 
            favClassDiv         =   'userData',
            favClick            =   userData ? userData.Favorite : null;

    return([favClassDiv,favClick,isFavorite])
}           
export const finishedFilter = (userData) => {
    const   isFinished          =   (userData && userData.Status==='Finished') ? true : false,
            status              =   isFinished ? 'Finished' : '',
            finishedClassDiv    =   'userData';

    return([finishedClassDiv,isFinished,status])
}
export const inProgressFilter = (userData,isFinished) => {
    const   isInProgress        =   (userData && userData.Status==='In Progress') ? true : false,
            inProgressClassDiv  =   'userData',
            isDisabled          =   isFinished   ? `${inProgressClassDiv} Disabled` : inProgressClassDiv,
            statusClick         =   (userData && userData.Status) ? userData.Status : null;

    return([inProgressClassDiv,isInProgress,isDisabled,statusClick])
}
export const ignoreFilter = (userData) => {
    const   ignoreClassDiv      =   'userData',
            isIgnored        =   (userData && userData.Ignore===true) ? true : false,
            ignoreClick         =   userData ? userData.Ignore : null;

    return([ignoreClassDiv,ignoreClick,isIgnored])
}
export const readingListFilter = (userData)=>{
    const   inReadingList     =   (userData && (userData.ReadingList!==''||userData.ReadingList.length>0)) ? true : false;
    
    return([inReadingList])
}