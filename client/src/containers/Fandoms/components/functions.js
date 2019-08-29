export const completeFanfics = (fandom) =>{
    console.log('fandom:',fandom)
    let ao3 = fandom['AO3'] && fandom['AO3'].CompleteFanfics ? Number(fandom['AO3'].CompleteFanfics) : 0;
    let ff =  fandom['FF'] && fandom['FF'].CompleteFanfics ? Number(fandom['FF'].CompleteFanfics) : 0;

    let count = ao3+ff;

    return count.toLocaleString(undefined, {maximumFractionDigits:2})
}

export const onGoingFanfics = (fandom) =>{
    let ao3 = fandom['AO3'] && fandom['AO3'].OnGoingFanfics ? Number(fandom['AO3'].OnGoingFanfics) : 0;
    let ff = fandom['FF'] && fandom['FF'].OnGoingFanfics ? Number(fandom['FF'].OnGoingFanfics) : 0;

    let count = ao3+ff;

    return count.toLocaleString(undefined, {maximumFractionDigits:2})
}

export const deletedFanfics = (fandom) =>{
    let ao3 = fandom['AO3'] && fandom['AO3'].DeletedFanfics ? Number(fandom['AO3'].DeletedFanfics) : 0;
    let ff = fandom['FF'] && fandom['FF'].DeletedFanfics ? Number(fandom['FF'].DeletedFanfics) : 0;

    let count = ao3+ff;

    return count.toLocaleString(undefined, {maximumFractionDigits:2})
}

export const savedFanfics = (fandom) =>{
    let ao3 = fandom['AO3'] && fandom['AO3'].SavedFanfics ? Number(fandom['AO3'].SavedFanfics) : 0;
    let ff = fandom['FF'] && fandom['FF'].SavedFanfics ? Number(fandom['FF'].SavedFanfics) : 0;

    let count = ao3+ff;

    return count.toLocaleString(undefined, {maximumFractionDigits:2})
}