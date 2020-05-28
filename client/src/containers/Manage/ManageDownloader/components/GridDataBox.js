import React,{Component} from 'react';
import { Grid } from '@material-ui/core';
import { savedFanfics, deletedFanfics } from '../../../Fandoms/components/functions';
import DuplicateTitles from './DuplicateTitles'

class GridDataBox extends Component{
    render(){
        let grid = '';
        const {fandom,logs,showData,showBox, duplicatesList} = this.props;

        switch (showData) {
            case 0:
                grid = <div className='code_box'>{logs.map((log,index)=>(<p key={index} dangerouslySetInnerHTML={{ __html:log}}/>))}</div>                
                break;
            case 1:
                grid =                                         
                <div className='code_box'>
                    <p><b>Fandom Name:</b> {fandom.FandomName}</p>
                    <p><b>Fanfics in Fandom:</b> {fandom.FanficsInFandom}</p>
                    <p><b>Saved Fanfics:</b> {savedFanfics(fandom)}</p>
                    <p><b>Deleted Fanfics:</b> {deletedFanfics(fandom)}</p>
                    <p><b>Last Update:</b> {new Date(fandom.FanficsLastUpdate).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</p>
                </div>
                break;
            case 2:
                grid =
                <>
                    <div className='code_box short'>
                        {logs.map((log,index)=>(<p key={index} dangerouslySetInnerHTML={{ __html:log}}/>))}
                        {duplicatesList.length===0 && <p>There is No Duplication that we didn't handle in this fandom.</p>}
                    </div>  
                    {duplicatesList.length>0 && <DuplicateTitles list={duplicatesList} fandomName={fandom.FandomName}/>}
                </>
                break;
            default:
                break;
        }
        return(
            showBox ? <Grid className='grid_code' item xs={this.props.smallSizeMode ? 12 : this.props.xs}>{grid}</Grid> : null
        )
    }

};

export default GridDataBox;