import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import theme from './theme';
import Home from './home/home';

const root = document.createElement('div');
root.id = 'app';
document.body.appendChild(root);

render(
    <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <Home />
    </MuiThemeProvider>,
    document.getElementById('app')
);

