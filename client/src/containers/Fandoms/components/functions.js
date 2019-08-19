export const completeFanfics = (fandom) =>{
    let ao3 = fandom.AO3CompleteFanfics ? Number(fandom.AO3CompleteFanfics) : 0;
    let ff = fandom.FFCompleteFanfics ? Number(fandom.FFCompleteFanfics) : 0;

    let count = ao3+ff;

    return count.toLocaleString(undefined, {maximumFractionDigits:2})
}

export const onGoingFanfics = (fandom) =>{
    let ao3 = fandom.AO3OnGoingFanfics ? Number(fandom.AO3OnGoingFanfics) : 0;
    let ff = fandom.FFOnGoingFanfics ? Number(fandom.FFOnGoingFanfics) : 0;

    let count = ao3+ff;

    return count.toLocaleString(undefined, {maximumFractionDigits:2})
}

export const deletedFanfics = (fandom) =>{
    let ao3 = fandom.AO3DeletedFanfics ? Number(fandom.AO3DeletedFanfics) : 0;
    let ff = fandom.FFDeletedFanfics ? Number(fandom.FFDeletedFanfics) : 0;

    let count = ao3+ff;

    return count.toLocaleString(undefined, {maximumFractionDigits:2})
}

export const savedFanfics = (fandom) =>{
    let ao3 = fandom.AO3SavedFanfics ? Number(fandom.AO3SavedFanfics) : 0;
    let ff = fandom.FFSavedFanfics ? Number(fandom.FFSavedFanfics) : 0;

    let count = ao3+ff;

    return count.toLocaleString(undefined, {maximumFractionDigits:2})
}