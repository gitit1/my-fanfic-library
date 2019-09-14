import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

const GeneralFilters = ({classes,checked,filter}) => {
    const [flag, setAnchorEl] = React.useState(false,null);

    function toggleFanficsFilters(e) {
        e.preventDefault();
        setAnchorEl(!flag);
    }

    return(
        <React.Fragment>
                <FormControl className={classes.FormControl} component="fieldset">
                    <FormLabel focused={false} className={classes.FiltersFanficLabel} onClick={toggleFanficsFilters}>
                        <span style={{display: 'flex',alignItems: 'center'}}>
                            <i className="material-icons">{flag ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}</i>
                            Fanfic General Filters:
                        </span>
                    </FormLabel>
                    { flag &&
                    <React.Fragment>
                    <FormLabel focused={false} className={classes.FiltersFanficLabel}></FormLabel>
                        <TextField
                            id="id"
                            label="Fanfic ID"
                            // style={{ margin: 8 }}
                            // fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={checked['fanficId']}
                            onChange={(event)=>filter('fanficId',event,'filter')}
                        />
                        <TextField
                            id="words_from"
                            label="Words Count"
                            // style={{ margin: 8 }}
                            placeholder="From"
                            type="number"
                            // fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={checked['wordsFrom']} 
                            onChange={(event)=>filter('wordsFrom',event,'filter')}
                        />
                        <TextField
                            id="words_to"
                            className={classes.textField}
                            value={checked['wordsTo']} 
                            type="number"
                            // style={{ margin: 8 }}
                            margin="normal"
                            placeholder="To"
                            onChange={(event)=>filter(`wordsTo`,event,'filter')}
                        />
                        <TextField
                            id="title"
                            label="Title"
                            // style={{ margin: 8 }}
                            // fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={checked['title']}
                            onChange={(event)=>filter('title',event,'filter')}
                        />
                        <TextField
                            id="author"
                            label="Author"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={checked['author']}
                            onChange={(event)=>filter('author',event,'filter')}
                        />
                    </React.Fragment>
                    }
            </FormControl>
            <Divider variant='fullWidth' className={classes.Devider}/>   
        </React.Fragment>
    )
}
export default GeneralFilters;