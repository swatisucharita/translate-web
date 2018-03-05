import axios from 'axios';

class Interpreter {
    constructor(){
        this.text = '';
        this._callbacks = {};
        this._handler = {};
        this._voices = [];
        if(this.supportsSpeechRecognition()){
            this.recorder = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
            this.recorder.interimResults = false;
            this.recorder.maxAlternatives = 5;
            
            this.recorder.onresult = (event) => {
                this.text = event.results[0][0].transcript;
                console.log('Listened: ', this.text);
                this.broadcast();
            };
        }
        
        // install speech synthesis
        if (this.supportsSpeechSynthesis()){
            this.speaker = new SpeechSynthesisUtterance();            
        } 
    }

    supportsSpeechRecognition(){
        return (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition);
    }

    supportsSpeechSynthesis(){
        return ('speechSynthesis' in window);
    }

    get voices(){
        if (!this.supportsSpeechSynthesis()){
            return [];
        }

        if (this._voices.length === 0){
            this._voices = window.speechSynthesis.getVoices();
        }

        return this._voices;
    }

    subscribeListening(cb){
        const {id, handler} = cb;
        if (!this._callbacks[id]){
            this._callbacks[id] = [handler];
        }
    }

    broadcast(){
        const text = this.text;
        (this._callbacks[this._handler.id] || []).forEach(cb => {
            cb(text);
        });
    }

    listen(lang, cb){
        if (!this.recorder){
            new Error('no recorder');
        }

        this._handler = cb;
        this.subscribeListening(cb);
        this.recorder.lang = lang;
        this.recorder.start();
    }

    stopListening(){
        if (!this.recorder){
            new Error('no recorder');
        }

        this.recorder.stop();
    }

    translate(text, toLang){
        // translate API does not understand the county of the langcode
        toLang = toLang.split('-')[0];
        return axios.post('/translate', {to:toLang, text}).then(res => {
            console.log('translated text: ', res);
            const toText = res.data.text;
            return res.data;
        });
    }

    speak(text, lang){
        if (!this.speaker){
            return;
        }
   
        // this.speaker.voice = this.voices[0];
        this.speaker.text = text;
        this.speaker.lang = lang;

        this.speaker.onend = function(e) {
            console.log('Finished in ' + e.elapsedTime + ' seconds.');
        };

        this.speaker.onerror = (error) => {
            console.log('Failed to speak Error: ', error);
        }
        speechSynthesis.speak(this.speaker);
    }
}

const interpreter = new Interpreter();
export default interpreter;