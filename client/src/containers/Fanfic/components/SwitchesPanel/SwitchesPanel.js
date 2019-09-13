import React from 'react';
import Switch from '../../../../components/UI/Switches/switches'

const SwitchesPanel = (props) => {
    const {fandomName,switchChange,switches,isManager} = props.switchesPanel;
    console.log('isManager:',isManager)
    return(
        // <p>test</p>
        <div className='SwitchesPanel'>
            {
                switches.map(sw => (
                    !sw.manager ? <Switch key={sw.id} id={sw.id} fandomSelect={fandomName} changed={switchChange} checked={sw.checked} label={sw.label}/> 
                    : isManager ? <Switch key={sw.id} id={sw.id} fandomSelect={fandomName} changed={switchChange} checked={sw.checked} label={sw.label}/>
                    : null
                ))
            }
        </div>

    )
};

export default SwitchesPanel;