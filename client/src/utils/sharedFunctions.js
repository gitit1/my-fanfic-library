export const updateObject = (oldObject, updatedProperties) =>{
    return{
        ...oldObject,
        ...updatedProperties
    }
}

export const shorten = (s,l) =>{
    return (s.match(new RegExp(".{"+l+"}\\S*"))||[s])[0];
}

export const getRandomColor = () =>{
    console.log('[SharedFunctions] getRandomColor()')
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}