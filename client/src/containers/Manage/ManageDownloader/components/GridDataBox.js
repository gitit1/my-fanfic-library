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
                    <p><b>Search Keys:</b> {fandom.SearchKeys}</p>
                    {fandom.FFSearchUrl && <p><b>FFSearchUrl:</b> {fandom.FFSearchUrl}</p>}
                    <p><b>Priority:</b> {fandom.Priority}</p>
                    <p><b>Fanfics in Fandom:</b> {fandom.FanficsInFandom.toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</p>
                    <p><b>Saved Fanfics:</b> {savedFanfics(fandom)}</p>
                    <p><b>Deleted Fanfics:</b> {deletedFanfics(fandom)}</p>
                    <p><b>Last Update:</b> {new Date(fandom.FanficsLastUpdate).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</p>
                </div>
                break;
            case 2:
                grid = <DuplicateTitles list={duplicatesList} fandomName={fandom.FandomName} logs={logs}/>
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