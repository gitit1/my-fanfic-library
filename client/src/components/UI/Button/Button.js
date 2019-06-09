import React,{Component} from 'react';
import classes from './Button.module.css';

class Button extends Component{
    render(){
        
        return(
            <button
                disabled={this.props.disabled}
                className={[classes.Button, classes[this.props.btnType]].join(' ')} 
                onClick={this.props.clicked}
                style={{
                    '--theme-primary-color': this.props.backColorFrimary,
                    '--theme-secondery-color': this.props.backColorSecondary,
                    'color': this.props.textColor
                }}
                //style={{'backgroundColor':props.backColor,}}>
                >
                {this.props.children}
            </button>
        )

        
    }
}

export default Button;