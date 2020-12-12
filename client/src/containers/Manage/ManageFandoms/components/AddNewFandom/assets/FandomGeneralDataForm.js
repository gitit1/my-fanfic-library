export const fandomGeneralForm = [{
    FandomName: {
        label: 'Fandom Name:',
        elementType: 'input',
        elementConfig: {
            type: 'text',
            placeholder: 'Fandom Name [For Example: Clexa]'
        },
        value: '',
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        visible: true,
        disabled: false
    },
    FandomUniverse: {
        label: 'Fandom Universe:',
        elementType: 'input',
        elementConfig: {
            type: 'text',
            placeholder: 'Fandom Universe (Media) [For Example: The 100 (TV)]'
        },
        value: '',
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        visible: true,
        disabled: false
    },
    SearchKeys: {
        label: 'Search Key:',
        elementType: 'input',
        elementConfig: {
            type: 'text',
            placeholder: 'Search Key - Seperate by Comma [For Example: Clexa, Clarke Griffin/Lexa]'
        },
        value: '',
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        visible: true,
        disabled: false
    },
    FFSearchUrl: {
        label: 'FF Link:',
        elementType: 'input',
        elementConfig: {
            type: 'text',
            placeholder: 'FF Links - Seperate by Comma'
        },
        value: '',
        validation: {},
        valid: true,
        touched: false,
        visible: true,
        disabled: false
    },
    Priority: {
        label: 'Priority of Fandom',
        elementType: 'select',
        elementConfig: {
            options: [{ value: 1, displayValue: '1 - Large Fandom' },
            { value: 2, displayValue: '2 - Medium Fandom' },
            { value: 3, displayValue: '3 - Small Fandom' }
            ]
        },
        value: 1,
        validation: {},
        valid: true,
        visible: true,
        disabled: false
    },
    AutoSave: {
        label: 'Save Fanfics Automatic to Server?',
        elementType: 'select',
        elementConfig: {
            options: [{ value: false, displayValue: 'No' },
            { value: true, displayValue: 'Yes' }
            ]
        },
        value: '',
        validation: {},
        valid: true,
        visible: true,
        disabled: false
    },
    SaveMethod: {
        label: 'Save Methods:',
        elementType: 'checkbox',
        classNameCustom: 'save_method_checkbox',
        elementConfig: {
            options: [
                { value: 'azw3', displayValue: 'azw3', checked: false },
                { value: 'epub', displayValue: 'epub', checked: false },
                { value: 'mobi', displayValue: 'mobi', checked: false },
                { value: 'pdf', displayValue: 'pdf', checked: false },
                { value: 'html', displayValue: 'html', checked: false }
            ]
        },
        value: '',
        validation: {},
        valid: true,
        visible: false,
        disabled: false
    },
    Collection: {
        label: 'Link to Collection?',
        elementType: 'select',
        elementConfig: {
            options: [
                { value: false, displayValue: 'No' },
                { value: true, displayValue: 'Yes' }
            ]
        },
        value: false,
        validation: {},
        valid: true,
        visible: true,
        disabled: false
    },
    CollectionName: {
        label: 'Collection Name:',
        elementType: 'input',
        elementConfig: {
            type: 'text',
            placeholder: 'Collection Name'
        },
        value: '',
        validation: {
            required: false
        },
        valid: true,
        touched: false,
        visible: false,
        disabled: false
    },
}]