import React from 'react';
import Translator from '../translator/translator';
import About from '../about/about';

import background from '../images/background.jpeg';

const style = {
    background: {
        top: 0,
        left: 0,
        position: 'fixed',
        width: '100vw',
        opacity: 0.3
    },
    header: {
        textAlign: 'center',
        color: 'red'
    },
    content: {
        margin: '30px 0'
    }
};
export default class Home extends React.Component {
    render(){
        return <div>
            <img src={background} style={style.background} />
            <h1 style={style.header}>That which we are capable of feeling, we are capable of saying</h1>
            <div style={style.content}>
                <Translator />
            </div>
            <div>
                <About />
            </div>
        </div>;
    }
}