const axios = require('../../axios-firebase');


exports.addFandomToDB = (req,res) =>{
    console.log('[db] addFandomToDB');
    let date = new Date().getTime()
    const fandom = {
        "Save_Method": ["PDF","EPUB"],
        "Fanfics_in_Fandom": 0,
        "Fandom_Name": "Cazzie",
        "On_Going_Fanfics": 0,
        "Last_Update": date,
        "Complete_fanfics": 0,
        "Saved_fanfics": 0,
        "Search_Keys": "Casey Gardner/Izzie",
        "Auto_Save": "YES"
    }
    axios.post( 'fandoms.json', fandom )
    .then( response => {
        res.send('Fandom '+fandom.Fandom_Name+' ,added to db')
    } )
    .catch( error => {
        res.send('error in [db] addFandomToDB')
        console.log(error)
    } );
    //TODO: ADD FIXED IMAGE TO  FANFICS / ADDITIONAL IMAGE FOR ONESHOT IF THEY WANT 
    //console.log(date)
    //console.log(new Date(date).toLocaleString())
    
}

exports.getAllFandomsFromDB = (req,res) =>{
    console.log('[db] getAllFandomsFromDB');
    axios.get( 'fandoms.json')
    .then( response => {
        res.send(response.data)
    } )
    .catch( error => {
        res.send('error in [db] addFandomToDB')
        console.log(error)
    } );
}