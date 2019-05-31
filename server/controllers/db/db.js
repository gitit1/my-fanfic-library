const axios = require('axios');


exports.connectToAo3 = async (req,res) => {
   console.log('[ao3] connectToAo3');


   res.send('hello')
};


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
    axios.post( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json', fandom )
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
