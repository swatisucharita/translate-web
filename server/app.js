const translate = require('google-translate-api');
const speech = require('@google-cloud/speech');

const bodyParser = require('body-parser');
const fs = require('fs');

const jsonParser = bodyParser.json({limit: '50mb'});

module.exports = function App(app) {
    this._app = app;

    this.registerTranslateApis = function(){
        // Your Google Cloud Platform project ID
        const projectId = process.env.PROJECT_ID; // 'your-project-id';
        console.log('project id: ', projectId);

        // Creates a client
        const client = new speech.SpeechClient({
            projectId: projectId,
        });

        app.post('/recogniseSpeech', jsonParser, (req, res) => {
            const {content, from} = req.body;

            const audio = {
                content
            };
            const config = {
                languageCode: from,
            };
            // const audio = {
            //     content: fs.readFileSync('./resources/recording.wav').toString('base64'),
            // };
            const request = {
                audio: audio,
                config: config,
            };

            client
            .recognize(request)
            .then(data => {
              const response = data[0];
              const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');
              console.log(`Transcription: ${transcription}`);
              res.json({result: response});
            })
            .catch(err => {
              console.error('ERROR:', err);
              res.status(500).send('Failed to recognise');
            });
              
        });

        // Post because, the text to translate can be huge sometimes. To avoid url size constraint
        app.post('/translate', jsonParser, (req, res) => {
            const {from, to, text} = req.body;

            translate(text, {to}).then(result => {
                console.log(result.text);
                //=> I speak English 
                console.log(result.from.language.iso);
                //=> nl 
                res.json(result);
            }).catch(err => {
                console.log('error: ', err);
                res.status(500).send('Failed to translate');
            });
        });
    }
}