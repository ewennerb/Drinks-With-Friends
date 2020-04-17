
import { createGlobalStyle } from 'styled-components';
import {darkTheme} from './theme';

export const GlobalStyles = createGlobalStyle`
    *,
    *::after,
    *::before {
        box-sizing: border-box;
    }

    body {
        align-items: center;
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        height: 100vh;
        margin: 0;
        padding: 0;
        font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        transition: all 0.25s linear;
    }
    .ui, .header {
        background: ${({ theme }) => theme.body} !important;
    }
    
    .ui, .drinklink, .header, .menu .item, .ui > *, .inline.fields > label, .inline.fields .field>label, a{
        color: ${({ theme }) => theme.text} !important;
    }

    .meta, .ui.card .meta>a:not(.ui) {
        color: ${({theme}) => theme.text = darkTheme.text ? '#9c9c9c' : 'grey'} !important
    }

    .ui.vertical.menu {
        background: ${({ theme }) => theme.body = darkTheme.body ? '#3d3d3d' : 'white'};
    }
    .ui.button {
        background: ${({ theme }) => theme.button = darkTheme.button ? '#fbbd08' : 'white'} !important;
        margin-bottom: 10px;
    }
    .ui.buttons > .button {
        margin-right: 10px;
        margin-left: 10px;
        width: 20% !important;
        border-radius: .28571429rem;
    }
    .ui.fluid.input>input, .ui.form .field .ui.input input{
        color: black !important;
    }

    .confirmation > *, .confirmation > * > .ui, .confirmation > * > .ui > .ui > label,.ui.inverted.placeholder>:before {
        background: black !important;
        color: white !important;
    }
  `