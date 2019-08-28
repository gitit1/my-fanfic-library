import React,{Component} from 'react';
import classes from './Button.module.css';
import Button from '@material-ui/core/Button';

class NewButton extends Component{
    render(){       
        return(
            <Button
                variant="contained" 
                disabled={this.props.disabled}
                className={[classes[this.props.className]].join(' ')} 
                onClick={this.props.clicked}
                >
                {this.props.children}
            </Button>
        )

        
    }
}

export default NewButton;