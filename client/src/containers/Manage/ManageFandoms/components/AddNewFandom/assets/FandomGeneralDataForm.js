export const fandomGeneralForm = [{
    FandomName: {
            label: 'Fandom Name:',
            elementType: 'input', 
            elementConfig:{
                type: 'text',
                placeholder: 'Fandom Name'
            },
            value:'',
            validation: {
                required: true
            },
            valid:false,
            touched:false,
            visible: true,
            disabled:false
    },
    FandomUniverse: {
        label: 'Fandom Universe:',
        elementType: 'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Fandom Universe'
        },
        value:'',
        validation: {
            required: true
        },
        valid:false,
        touched:false,
        visible: true,
        disabled:false
},
    SearchKeys: {
        label: 'Search Key:',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Search Key'
        },
        value:'',
        validation: {
            required: true
        },
        valid:false,
        touched:false,
        visible: true,
        disabled:false
    },
    AutoSave: {
        label: 'Save Fanfics Automatic to Server?',
        elementType:'select', 
        elementConfig:{
            options: [{value: false,displayValue: 'No'},
                      {value: true,displayValue: 'Yes'}
                      ]
        },
        value:'',
        validation:{},
        valid: true,
        visible: true,
        disabled:false
    },
    SaveMethod: {
        label: 'Save Methods:',
        elementType:'checkbox',
        classNameCustom: 'save_method_checkbox',
        elementConfig:{
            options: [{value: 'azw3' ,displayValue:  'azw3' ,checked: false},
                      {value: 'epub' ,displayValue: 'epub'  ,checked: false},
                      {value: 'mobi' ,displayValue: 'mobi'  ,checked: false},
                      {value: 'pdf'  ,displayValue:  'pdf'  ,checked: false},
                      {value: 'html' ,displayValue: 'html'  ,checked: false}]
        },
        value:'',
        validation:{},
        valid: true,
        visible: false,
        disabled:false
    }
}]