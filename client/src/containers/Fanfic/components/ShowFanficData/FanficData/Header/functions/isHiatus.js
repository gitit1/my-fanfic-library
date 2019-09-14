export const isHiatus = (date) => {
    // Copy date so don't affect original
    var d = new Date();
    // Get the current month number
    var m = d.getMonth();
    // Subtract 6 months
    d.setMonth(d.getMonth() - 6);
    // If the new month number isn't m - 6, set to last day of previous month
    // Allow for cases where m < 6
    var diff = (m + 12 - d.getMonth()) % 12;
    if (diff < 6) d.setDate(0)
    
    return (d.getTime()>date);
  }
