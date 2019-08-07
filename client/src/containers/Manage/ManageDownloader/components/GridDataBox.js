import React,{Component} from 'react';
import { Grid } from '@material-ui/core';
import AddNewFanfic from './AddNewFanfic/AddNewFanfic'

class GridDataBox extends Component{
    render(){
        let grid = '';
        const {fandom,logs,showData,switches} = this.props;

        switch (showData) {
            case 0:
                grid = <div className='code_box'>{logs.map((log,index)=>(<p key={index} dangerouslySetInnerHTML={{ __html:log}}/>))}</div>                
                break;
            case 1:
                grid =                                         
                <div className='code_box'>
                    <p><b>Fandom Name:</b> {fandom.FandomName}</p>
                    <p><b>Fanfics in Fandom:</b> {fandom.FanficsInFandom}</p>
                    <p><b>Saved Fanfics:</b> {fandom.SavedFanfics}</p>
                    <p><b>Deleted Fanfics:</b> {fandom.DeletedFanfics ? fandom.DeletedFanfics : 0 }</p>
                    <p><b>Last Update:</b> {new Date(fandom.FanficsLastUpdate).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</p>
                </div>
                break;
            case 2:
                grid = <AddNewFanfic fandomName={fandom.FandomName} switches={switches}/>
            default:
                break;
        }
        return(<Grid className='grid_code' item xs={6}>{grid}</Grid>)
    }

};

export default GridDataBox;