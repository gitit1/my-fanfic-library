export const completeFanfics = (fandom) => {
    const ao3 = fandom['AO3'] && fandom['AO3'].CompleteFanfics ? Number(fandom['AO3'].CompleteFanfics) : 0;
    const ff = fandom['FF'] && fandom['FF'].CompleteFanfics ? Number(fandom['FF'].CompleteFanfics) : 0;
    const wattpad = fandom['Wattpad'] && fandom['Wattpad'].CompleteFanfics ? Number(fandom['Wattpad'].CompleteFanfics) : 0;

    const count = ao3 + ff + wattpad;

    return count.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export const onGoingFanfics = (fandom) => {
    const ao3 = fandom['AO3'] && fandom['AO3'].OnGoingFanfics ? Number(fandom['AO3'].OnGoingFanfics) : 0;
    const ff = fandom['FF'] && fandom['FF'].OnGoingFanfics ? Number(fandom['FF'].OnGoingFanfics) : 0;
    const wattpad = fandom['Wattpad'] && fandom['Wattpad'].OnGoingFanfics ? Number(fandom['Wattpad'].OnGoingFanfics) : 0;

    const count = ao3 + ff + wattpad;

    return count.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export const deletedFanfics = (fandom) => {
    let ao3 = fandom['AO3'] && fandom['AO3'].DeletedFanfics ? Number(fandom['AO3'].DeletedFanfics) : 0;
    let ff = fandom['FF'] && fandom['FF'].DeletedFanfics ? Number(fandom['FF'].DeletedFanfics) : 0;
    let wattpad = fandom['Wattpad'] && fandom['Wattpad'].DeletedFanfics ? Number(fandom['Wattpad'].DeletedFanfics) : 0;

    let count = ao3 + ff + wattpad;

    return count.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export const savedFanfics = (fandom) => {
    let ao3 = fandom['AO3'] && fandom['AO3'].SavedFanfics ? Number(fandom['AO3'].SavedFanfics) : 0;
    let ff = fandom['FF'] && fandom['FF'].SavedFanfics ? Number(fandom['FF'].SavedFanfics) : 0;
    let wattpad = fandom['Wattpad'] && fandom['Wattpad'].SavedFanfics ? Number(fandom['Wattpad'].SavedFanfics) : 0;

    let count = ao3 + ff + wattpad;

    return count.toLocaleString(undefined, { maximumFractionDigits: 2 })
}