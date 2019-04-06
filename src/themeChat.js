const theme = {
    vars: {
        'primary-color': '#311b92', //dark purple '#427fe1',
        'secondary-color':  '#BBDEFB', //sky blue '#fbfbfb',
        'tertiary-color': '#fff',
        'avatar-border-color': 'blue',
    },
    AgentBar: {
        Avatar: {
            size: '42px',
        },
        css: {
            backgroundColor: 'var(--secondary-color)',
            borderColor: 'var(--avatar-border-color)',
        }
    },
    Message: {
        css: {
            fontSize: 16,
        },
    },
}

export default theme;