export interface Theme {
    name: string;
    base: string;
    background: string;
    black: string;
}

export const Themes: { [key: string]: Theme } = {
    default: {
        name: 'default',
        base: '#6c6685',
        background: '#423e54',
        black: '#3c4368'
    },
    orange: {
        name: 'orange',
        base: '#a66202',
        background: '#442801',
        black: '#3c4368'
    },
    lightblue: {
        name: 'lightblue',
        base: '#0278a6',
        background: '#01364b',
        black: '#3c4368'
    },
    blue: {
        name: 'blue',
        base: '#625df5',
        background: '#232155',
        black: '#3c4368'
    },
    lightyellow: {
        name: 'lightyellow',
        base: '#ffc65c',
        background: '#644e26',
        black: '#3c4368'
    },
    green: {
        name: 'green',
        base: '#30874b',
        background: '#153b21',
        black: '#3c4368'
    },
    red: {
        name: 'red',
        base: '#b53434',
        background: '#581a1a',
        black: '#3c4368'
    }
};
