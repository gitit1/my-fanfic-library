export const MarkAs = (fanficId,markType,mark) =>{
    console.log('!mark,,,',!mark)
    await this.props.onMarkHandler(this.props.userEmail,this.props.match.params.FandomName,fanficId,markType,!mark)
    const userFanficsCopy = [...this.state.userFanfics];

    let objIndex = userFanficsCopy.findIndex((fanfic => fanfic.FanficID === fanficId));      
    switch (markType) {
        case 'Favorite':
            if(objIndex!==-1){
                userFanficsCopy[objIndex].Favorite = !mark;
            }else{
                userFanficsCopy.push({
                    SavedType:[],
                    FanficID:fanficId,
                    [markType]:!mark
                })
            }
            return userFanficsCopy;
        case 'Follow':
            if(objIndex!==-1){
                userFanficsCopy[objIndex].Follow = !mark;
            }else{
                userFanficsCopy.push({
                    SavedType:[],
                    FanficID:fanficId,
                    [markType]:!mark
                })
            }
            return userFanficsCopy;
        default:
            break;               
    }
}

const mapDispatchedToProps = dispatch =>{
    return{
        onGetFandoms:           ()                                                          =>  dispatch(actions.getFandomsFromDB()),
        onGetFanfics:           (fandomName,pageNumber,pageLimit,userEmail)                 =>  dispatch(actions.getFanficsFromDB(fandomName,pageNumber,pageLimit,userEmail)),
        onMarkHandler:          (userEmail,fandomName,fanficId,markType,mark)               =>  dispatch(actions.addFanficToUserMarks(userEmail,fandomName,fanficId,markType,mark)),
        onStatusHandler:        (userEmail,fandomName,fanficId,statusType,status,data)      =>  dispatch(actions.addFanficToUserStatus(userEmail,fandomName,fanficId,statusType,status,data)),
        onGetFilteredFanfics:   (fandomName,userEmail,filters,pageLimit,pageNumber)         =>  dispatch(actions.getFilteredFanficsFromDB(fandomName,userEmail,filters,pageLimit,pageNumber))
    }
}
  
export default connect(mapStateToProps,mapDispatchedToProps)(MarkAs);
