import * as React from 'react';
import { Card, CardText, IconButton } from 'material-ui';
import RightArrowIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import LeftArrowIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import interpreter from '../interpreter';
import TranslatorSection from './translatorSection';

const style = {
    translateContainer: {
        display: 'flex',
        justifyContent: 'space-around'
    },
    button: {
        top: '45%'
    }
};

export default class Translator extends React.Component {
    constructor(props, context){
        super(props, context);

        this.translateText = this.translateText.bind(this);
        this.translateTo = this.translateTo.bind(this);
        this.setText1 = this.setText1.bind(this);
        this.setText2 = this.setText2.bind(this);
        this.setLang1 = this.setLang1.bind(this);
        this.setLang2 = this.setLang2.bind(this);
        this.setSourceLang = this.setSourceLang.bind(this);

        this.state = {
            lang1: 'en-IN',
            text1: '',
            lang2: 'hi-IN',
            text2:'',
            sourceLang: 'lang1',
            targetLang: 'lang2'
        };

    }
    translateText(){
        const {sourceLang, targetLang} = this.state;
        const text = sourceLang === 'lang1' ? this.state.text1 : this.state.text2;
        const lang = this.state[targetLang];
        interpreter.translate(text, lang).then(result => {
            const toText = result.text;
            if (sourceLang === 'lang1'){
                this.setState({text2: toText});
            } else {
                this.setState({text1: toText});
            }
        });
    }
    setText1(text1){
        this.setState({text1});

        if (this.state.targetLang === 'lang2'){
            this.translateTo(this.state.lang2, text1);
        }
    }
    setText2(text2){
        this.setState({text2});

        if (this.state.targetLang === 'lang1'){
            this.translateTo(this.state.lang1, text2);
        }
    }
    translateTo(lang, text){
        const {sourceLang, targetLang} = this.state;
        interpreter.translate(text, lang).then(result => {
            const toText = result.text;
            if (sourceLang === 'lang1'){
                this.setState({text2: toText});
            } else {
                this.setState({text1: toText});
            }
        });
    }
    setLang1(lang1){
        this.setState({lang1});

        if (this.state.targetLang === 'lang1'){
            this.translateTo(lang1, this.state.text1);
        }
    }
    setLang2(lang2){
        this.setState({lang2});

        if (this.state.targetLang === 'lang2'){
            this.translateTo(lang2, this.state.text2);
        }
    }
    setSourceLang(sourceLang){
        const targetLang = sourceLang === 'lang1' ? 'lang2' : 'lang1';
        this.setState({sourceLang, targetLang});
    }
    render(){
        return(
        <div style={style.translateContainer}>
                    <TranslatorSection 
                        key={'from'}
                        langCode={'lang1'}
                        language={this.state.lang1} 
                        text={this.state.text1} 
                        onLanguageChange={this.setLang1} 
                        onTextChange={this.setText1}
                        onStartMic={this.setSourceLang}
                        showSpeaker={this.state.targetLang === 'lang1'}
                    />
                    <div>
                        <IconButton onClick={this.translateText} style={style.button}>
                            {this.state.targetLang === 'lang2' ? <RightArrowIcon /> : <LeftArrowIcon />}
                        </IconButton>
                    </div>
                    <TranslatorSection  
                        key={'to'}
                        langCode={'lang2'}
                        language={this.state.lang2} 
                        text={this.state.text2} 
                        onLanguageChange={this.setLang2} 
                        onTextChange={this.setText2}
                        onStartMic={this.setSourceLang}
                        showSpeaker={this.state.targetLang === 'lang2'} 
                    />
        </div>);
    }
}