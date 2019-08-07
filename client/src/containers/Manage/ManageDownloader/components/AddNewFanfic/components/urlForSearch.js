import React from 'react';
import TextField from '@material-ui/core/TextField';


const UrlForSearch = (props) => (
      <TextField
          id="url"
          label="Url"
          placeholder="Url"
          type="text"
          margin="normal"
          InputLabelProps={{
              shrink: true,
          }}
          className='input_url'
          value={props.url} 
          onChange={(event)=>props.inputChanged(event,'url')}
      />
);

export default UrlForSearch;