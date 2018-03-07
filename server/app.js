const translate = require('google-translate-api');

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json({limit: '50mb'});

module.exports = function App(app) {
    this._app = app;

    this.registerTranslateApis = function(){
        // Post because, the text to translate can be huge sometimes. To avoid url size constraint
        app.post('/translate', jsonParser, (req, res) => {
            const {to, text} = req.body;

            translate(text, {to}).then(result => {
                res.json(result);
            }).catch(err => {
                console.log('error: ', err);
                res.status(500).send('Failed to translate');
            });
        });
    }
}