export const updateObject = (oldObject, updatedProperties) =>{
    return{
        ...oldObject,
        ...updatedProperties
    }
}

export const shorten = (s,l) =>{
    return (s.match(new RegExp(".{"+l+"}\\S*"))||[s])[0];
}