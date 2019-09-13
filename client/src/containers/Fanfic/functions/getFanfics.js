import {fanficsNumbersFunc} from '../components/FanficsNumbers/components/fanficsNumbersFunc';

export const getFanfics = async (pageNumber,pageLimit,fandoms,onGetFandoms,onGetFanfics,userEmail,fandomName) =>{
    userEmail = userEmail ? userEmail : null;


    (fandoms.length===0) &&  await onGetFandoms()
    return await onGetFanfics(fandomName,pageNumber,pageLimit,userEmail).then(()=>{
        const {fandoms,userFanfics,ignoredCount}  = this.props
        let fandom = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0];
        const fanficsNumbers = fanficsNumbersFunc(fandom,ignoredCount);

        return [fandomName,userFanfics,fanficsNumbers]
    })
}
