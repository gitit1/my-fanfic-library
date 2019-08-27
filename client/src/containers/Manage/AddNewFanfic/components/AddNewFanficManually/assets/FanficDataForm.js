export const fanficDataForm = [{
    FanficID: {
            label: 'Fanfic ID:',
            elementType: 'input', 
            elementConfig:{
                type: 'number',
                placeholder: 'Fanfic ID'
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
    NumberOfChapters: {
        label: 'Number of Chapters:',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Number of Chapters'
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
    Complete: {
        label: 'Complete',
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
    Oneshot: {
        label: 'Oneshot',
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
    }
}]