import React from 'react';

// class LatestUpdates extends Component{
//     render(){
//         return(

//         );
//     }
// }
const LatestUpdates = (props) => (
    <div className='todo'>
        {props.updates.map(update=>(
            <div key={Object.keys(update)}>
                <h4>{Object.keys(update)}</h4>
                <p>test</p>
                <React.Fragment>
                {
                    Object.keys(update).forEach(key => (    
                        <p>test 3</p>,                   
                        update[key].map(test=>(
                            (test[Object.keys(test)]!==null) ? (
                                <React.Fragment>
                                    <h4>{Object.keys(test)}</h4>
                                    <p>{test[Object.keys(test)][1]} new fanfics</p>
                                    <p>{test[Object.keys(test)][2]} got updated</p>
                                </React.Fragment>
                            ) : <p>test 2</p>
                        ))
                    ))
                }
                </React.Fragment>
            </div>
        ))}

        
    </div>
);

export default LatestUpdates;