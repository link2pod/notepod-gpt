export function getIsoDate(){
    const date = new Date()
    date.setUTCHours(0,0,0,0) 
    return date.toISOString()
}

export function getEntryName(){ return `entry${getIsoDate()}` }
