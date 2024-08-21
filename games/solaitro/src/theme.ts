export interface Theme {
    name: string;
    base: string;
    background: string;
    black: string;
}

export interface SwirlTheme {
    base: string;
    light: string;
    dark: string;
}

export const SwirlThemes: { [key: string]: SwirlTheme } = {
    default: {
        light: '0.6235, 0.6, 0.7216',
        base: '0.4235, 0.4, 0.5216',
        dark: '0.2235, 0.2, 0.3216'
    },
    orange: {
        light: '0.85098, 0.58431, 0.20784',
        base: '0.65098, 0.38431, 0.00784',
        dark: '0.45098, 0.18431, 0.0'
    },
    lightblue: {
        light: '0.20784, 0.67059, 0.85098',
        base: '0.00784, 0.47059, 0.65098',
        dark: '0.0, 0.27059, 0.45098'
    },
    blue: {
        light: '0.58431, 0.56471, 1.0',
        base: '0.38431, 0.36471, 0.96078',
        dark: '0.18431, 0.16471, 0.76078'
    },
    lightyellow: {
        light: '1.0, 0.97647, 0.56078',
        base: '1.0, 0.77647, 0.36078',
        dark: '0.8, 0.57647, 0.16078'
    },
    green: {
        light: '0.38824, 0.72941, 0.49412',
        base: '0.18824, 0.52941, 0.29412',
        dark: '0.0, 0.32941, 0.09412'
    },
    red: {
        light: '0.90980, 0.40392, 0.40392',
        base: '0.70980, 0.20392, 0.20392',
        dark: '0.50980, 0.00392, 0.00392'
    }
};

export const Themes: { [key: string]: Theme } = {
    default: {
        name: 'default',
        base: '#6c6685',
        background: '#423e54',
        black: '#2c2c2c'
    },
    orange: {
        name: 'orange',
        base: '#a66202',
        background: '#442801',
        black: '#2c2c2c'
    },
    lightblue: {
        name: 'lightblue',
        base: '#0278a6',
        background: '#01364b',
        black: '#2c2c2c'
    },
    blue: {
        name: 'blue',
        base: '#625df5',
        background: '#232155',
        black: '#2c2c2c'
    },
    lightyellow: {
        name: 'lightyellow',
        base: '#ffc65c',
        background: '#644e26',
        black: '#2c2c2c'
    },
    green: {
        name: 'green',
        base: '#30874b',
        background: '#153b21',
        black: '#2c2c2c'
    },
    red: {
        name: 'red',
        base: '#b53434',
        background: '#581a1a',
        black: '#2c2c2c'
    }
};
