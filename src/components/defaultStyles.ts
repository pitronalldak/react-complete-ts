const defaultStyles = {
    root: {
        position: 'relative',
        paddingBottom: '0px',
    },
    autocompleteInput: {
        top: '100%',
        height: '24px',
        backgroundColor: 'white',
        border: '1px solid #555',
        width: '100%',
    },
    autocompleteContainer: {
        position: 'absolute',
        top: '100%',
        backgroundColor: 'white',
        border: '1px solid #555',
        width: '100%',
        zIndex: 9999,
    },
    autocompleteItem: {
        backgroundColor: '#ffffff',
        padding: '5px',
        color: '#555',
        cursor: 'pointer',
    },
    autocompleteItemActive: {
        backgroundColor: '#fafafa'
    }
};

export default defaultStyles