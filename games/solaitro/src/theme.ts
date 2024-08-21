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
        light: '0.5, 0.5, 1.0',
        base: '0.0, 0.0, 1.0',
        dark: '0.0, 0.0, 0.5'
    },
    blue: {
        light: '0.5, 0.5, 1.0',
        base: '0.0, 0.0, 1.0',
        dark: '0.0, 0.0, 0.5'
    },
    lightyellow: {
        light: '1.0, 1.0, 0.5',
        base: '1.0, 1.0, 0.0',
        dark: '0.5, 0.5, 0.0'
    },
    green: {
        light: '0.5, 1.0, 0.5',
        base: '0.0, 1.0, 0.0',
        dark: '0.0, 0.5, 0.0'
    },
    red: {
        light: '1.0, 0.5, 0.5',
        base: '1.0, 0.0, 0.0',
        dark: '0.5, 0.0, 0.0'
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
