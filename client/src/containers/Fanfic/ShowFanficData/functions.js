import classes from './ShowFanficData.module.css';

export const greenClassesHandler = () =>{
    const greenDiv      =   `${classes.Green}  ${classes.UserData}`,
          greenDivOn    =   `${classes.GreenOn}  ${classes.UserData}`, 
          greenIcon     =   `${classes.Green} ${classes.Icon}`,
          greenIconOn   =   `${classes.GreenOn} ${classes.Icon}`
  //   greenLabel = `${classes.Green}  ${classes.UserData}`,greenLabelOn = `${classes.GreenOn} ${classes.IconLabel}`
  return([greenDiv,greenDivOn,greenIcon,greenIconOn])
}
export const redClassesHandler = () =>{
    const redDiv = `${classes.Red}  ${classes.UserData}`,
          redDivOn = `${classes.RedOn}  ${classes.UserData}`, 
          redIcon = `${classes.Red} ${classes.Icon}`,
          redIconOn = `${classes.RedOn} ${classes.Icon}`,
          redLabel = `${classes.Red}  ${classes.IconLabel}`,
          redLabelOn = `${classes.RedOn} ${classes.IconLabel}`

    return([redDiv,redDivOn,redIcon,redIconOn,redLabel,redLabelOn])
}
export const favoriteFilter = (userData,redClasses) =>{
    const   favClassDiv         =   (userData && userData.Favorite===true) ? redClasses[1] : redClasses[0],
            favClassIcon        =   (userData && userData.Favorite===true) ? redClasses[3] : redClasses[2],
            favClassLabel       =   (userData && userData.Favorite===true) ? redClasses[5] : redClasses[4],
            favClick            =   userData ? userData.Favorite : null;
    
    return([favClassDiv,favClassIcon,favClassLabel,favClick])
}           
export const finishedFilter = (userData,greenClasses,MarkedAsRead,MarkAsRead) => {
    const   isFinished          =   (userData && userData.Status==='Finished') ? true : false,
            finishedClassDiv    =   isFinished ? greenClasses[1] : greenClasses[0],
            finishedClassIcon   =   isFinished ? greenClasses[3] : greenClasses[2],
            finishedSvgSrc      =   isFinished ?  MarkedAsRead : MarkAsRead;

    return([isFinished,finishedClassDiv,finishedClassIcon,finishedSvgSrc])
}
export const inProgressFilter = (userData,greenClasses,isFinished,MarkedAsRead,MarkAsRead) => {
    const   isInProgress        =   (userData && userData.Status==='In Progress') ? true : false,
            inProgressClassDiv  =   isInProgress ? greenClasses[1] : greenClasses[0],
            inProgressClassIcon =   isInProgress ? greenClasses[3] : greenClasses[2],
            isDisabled          =   isFinished   ? `${inProgressClassDiv} ${classes.Disabled}` : inProgressClassDiv,
            inProgressSvgSrc    =   isInProgress ?  MarkedAsRead : MarkAsRead,
            statusClick         =   (userData && userData.Status) ? userData.Status : null;

    return([isInProgress,inProgressClassDiv,inProgressClassIcon,isDisabled,inProgressSvgSrc,statusClick])
}
export const ignoreFilter = (userData,redClasses) => {
    const   ignoreClassDiv      =   (userData && userData.Ignore===true) ? redClasses[1] : redClasses[0],
            ignoreClassIcon     =   (userData && userData.Ignore===true) ? redClasses[3] : redClasses[2],
            ignoreClassLabel    =   (userData && userData.Ignore===true) ? redClasses[5] : redClasses[4],
            // isIgnored        =   (userData && userData.Ignore===true) ? true : false,
            ignoreClick         =   userData ? userData.Favorite : null;

    return([ignoreClassDiv,ignoreClassIcon,ignoreClassLabel,ignoreClick])
}