import * as React from 'react';
import interpreter from '../interpreter';
import {allAvailableLanguages} from '../constants';

import { Card, CardText, IconButton, TextField, SelectField, MenuItem } from 'material-ui';
import MicIcon from 'material-ui/svg-icons/av/mic';
import SpeakIcon from 'material-ui/svg-icons/av/volume-up';
import MuteIcon from 'material-ui/svg-icons/av/volume-off';

const style = {
    largeIcon: {
        width: 60,
        height: 60,
    },
    large: {
        width: 120,
        height: 120,
        padding: 30,
    },
    containerCard: {
        width: '35%',
        backgroundColor: 'transparent'
    },
    textCenter: {
        textAlign: 'center'
    },
    speaker: {
        top: -50,
        float: 'right'
    }
};

export default class TranslatorSection extends React.Component {
    constructor(props, context){
        super(props, context);

        this.toggleRecording = this.toggleRecording.bind(this);
        this.toggleSpeaker = this.toggleSpeaker.bind(this);
        this.onRecieveText = this.onRecieveText.bind(this);
        this.pickLanguage = this.pickLanguage.bind(this);
        this.speakText = this.speakText.bind(this);

        // construct language list
        this.languages = allAvailableLanguages.reduce((result, languageInfo) => {
            if (languageInfo.countryCodes.length === 1){
                result.push({name: languageInfo.language, value: languageInfo.countryCodes[0].langCode});
            } else if (languageInfo.countryCodes.length > 1){
                languageInfo.countryCodes.forEach(info => {
                    result.push({name: `${languageInfo.language}-${info.country}`, value: info.langCode});
                });
            }

            return result;
        }, []);

        this.state = {
            recorderState: 'inactive',
            startSpeaking: false,
            speakerEnabled: this.props.showSpeaker || false
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.props.text !== nextProps.text && nextProps.showSpeaker){
            this.setState({startSpeaking: true});
        }

        if (this.props.showSpeaker !== nextProps.showSpeaker){
            this.setState({speakerEnabled: nextProps.showSpeaker || false});
        }
    }

    componentDidUpdate(){
        if (this.state.startSpeaking){
            this.state.speakerEnabled && this.speakText();
            this.setState({startSpeaking: false});
        }
    }

    onRecieveText(text){
        this.props.onTextChange(text);
    }

    toggleRecording(){
        let {recorderState} = this.state;

        if (recorderState === 'inactive'){
            interpreter.listen(this.props.language, {id: this.props.language, handler: this.onRecieveText});
            this.props.onStartMic(this.props.langCode);
            recorderState = 'active';
        } else if (recorderState === 'active') {
            interpreter.stopListening();
            recorderState = 'inactive';
        }

        this.setState({recorderState});
    }

    speakText(){
        interpreter.speak(this.props.text, this.props.language);
    }

    pickLanguage(event, index, language){
        this.props.onLanguageChange(language);
    }

    toggleSpeaker(){
        const {speakerEnabled} = this.state;

        this.setState({speakerEnabled: !speakerEnabled});
        // if it's turned on by the user
        if (speakerEnabled === false){
            this.speakText();
        }
    }

    render(){
        return (<Card style={style.containerCard}>
            <CardText>
                <div style={style.textCenter}>
                    <IconButton
                        iconStyle={style.largeIcon}
                        style={style.large}
                        onClick={this.toggleRecording}
                    >
                        <MicIcon color={this.state.recorderState === 'active' ? 'red' : 'black'} />
                    </IconButton>
                </div>
                <div>
                    <SelectField
                        floatingLabelText={"Choose Language"}
                        floatingLabelFixed={true}
                        value={this.props.language}
                        onChange={this.pickLanguage}
                        fullWidth={true}
                    >
                        {this.languages.map(language => {
                            return <MenuItem id={language.value} value={language.value} primaryText={language.name}/>
                        })}

                    </SelectField>
                </div>
                <div>
                    <TextField 
                        value={this.props.text}
                        multiLine={true}
                        rows={2}
                        fullWidth={true}
                    />
                    {this.props.showSpeaker && 
                        <IconButton
                            onClick={this.toggleSpeaker}
                            style={style.speaker}
                        >
                            {this.state.speakerEnabled ? <SpeakIcon /> : <MuteIcon />}
                        </IconButton>
                    }
                </div>
            </CardText>
        </Card>);
    }
}