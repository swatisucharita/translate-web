import * as React from 'react';
import theme from '../theme';
import {FlatButton, Popover, PopoverAnimationVertical} from 'material-ui';
import ActionHelp from 'material-ui/svg-icons/action/help';

const style = {
    container: {
        color: theme.palette.primary1Color        
    },
    infoContainer: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    center: {
        textAlign: 'center'
    },
    button: {
        textTransform: 'capitalize',
        fontWeight: 'bold',
        fontSize: '1.5em'
    }
}

export default class About extends React.Component {
    constructor(props, context){
        super(props, context);

        this.toggleText = this.toggleText.bind(this);

        this.state = {
            showText: false
        };
    }
    toggleText(event){
        const {showText} = this.state;

        this.setState({
            showText: !showText
        });
    }
    render(){
        return (<div style={style.container}>
            <FlatButton 
                labelStyle={style.button} 
                label="Help"
                labelPosition="before"
                fullWidth={true} 
                primary={true} 
                onClick={this.toggleText}
                icon={<ActionHelp />}
            />
            {this.state.showText && <div style={style.infoContainer}>
                <div style={style.center}>
                    <h2>This website works as an interpreter between people talking in two languages.</h2>
                    <h3>
                        Click on the mic for one language to start talking. The tool will translate the speech to the other language, when the user stops the mic.
                    </h3>
                </div>
            </div>}
        </div>);
    }
}