export const fandomGeneralForm = [{
    Fandom_Name: {
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
            visible: true
    },
    Search_Keys: {
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
        visible: true
    },
    Auto_Save: {
        label: 'Save Fanfics Automatic to Server?',
        elementType:'select', 
        elementConfig:{
            options: [{value: false,displayValue: 'No'},
                      {value: true,displayValue: 'Yes'}
                      ]
        },
        value:false,
        validation:{},
        valid: true,
        visible: true
    },
    Save_Method: {
        label: 'Save Methods:',
        elementType:'checkbox', 
        elementConfig:{
            options: [{value: 'azw3' ,displayValue:  'AZW3' ,checked: false},
                      {value: 'epub' ,displayValue: 'ePub'  ,checked: false},
                      {value: 'mobi' ,displayValue: 'Mobi'  ,checked: false},
                      {value: 'pdf'  ,displayValue:  'PDF'  ,checked: false},
                      {value: 'html' ,displayValue: 'Html'  ,checked: false}]
        },
        value:'',
        validation:{},
        valid: true,
        visible: false
    }
}]