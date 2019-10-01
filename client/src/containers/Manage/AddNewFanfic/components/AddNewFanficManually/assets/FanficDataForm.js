import  {categories} from '../../../../../Fanfic/components/ShowFanficData/FanficData/Categories/assets/categoriesList'

export const fanficDataForm = [{
    FanficID: {
            label: '(*) Fanfic ID:',
            classNameCustom:'FanficID',
            elementType: 'input', 
            elementConfig:{
                type: 'number',
                placeholder: '(*) Fanfic ID'
            },
            value:'',
            validation: {
                required: true,
                minLength:4
            },
            valid:false,
            touched:false,
            visible: true,
            disabled:false
    },
    Rating: {
        label: 'Rating',
        classNameCustom:'Rating',
        elementType:'select', 
        elementConfig:{
            options: [
                        {value: 'none',displayValue: 'None'},
                        {value: 'general',displayValue: 'General'},
                        {value: 'teen',displayValue: 'Teen'},
                        {value: 'mature',displayValue: 'Mature'},
                        {value: 'explicit',displayValue: 'Explicit'},       
                      ]
        },
        value:'',
        validation:{},
        valid: true,
        visible: true,
        disabled:false
    },
    FanficTitle: {
        label: '(*) Fanfic Title:',
        classNameCustom:'FanficTitle',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: '(*) Fanfic Title'
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
    Author: {
        label: '(*) Author:',
        classNameCustom:'Author',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: '(*) Author'
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
    FanficURL: {
        label: 'Fanfic URL:',
        classNameCustom:'FanficURL',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Fanfic URL'
        },
        value:'',
        validation: {},
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    AuthorURL: {
        label: 'Author URL:',
        classNameCustom:'AuthorURL',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Author URL'
        },
        value:'',
        validation: {},
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    FandomsTags: {
        label: 'Fandoms Tags:',
        classNameCustom:'FandomsTags',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Fandoms Tags - Seperate by comma , Example: "tag 1,tag 2"'
        },
        value:'',
        validation: {},
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    Warnings: {
        label: 'Warnings:',
        classNameCustom:'Warnings',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Warnings - Seperate by comma , Example: "tag 1,tag 2"'
        },
        value:'',
        validation: {},
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    Relationships: {
        label: 'Relationships:',
        classNameCustom:'Relationships',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Relationships - Seperate by comma , Example: "tag 1,tag 2"'
        },
        value:'',
        validation: {},
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    Characters: {
        label: 'Characters:',
        classNameCustom:'Characters',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Characters - Seperate by comma , Example: "tag 1,tag 2"'
        },
        value:'',
        validation: { },
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    Tags: {
        label: 'Free Tags:',
        classNameCustom:'Tags',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Free Tags - Seperate by comma , Example: "tag 1,tag 2"'
        },
        value:'',
        validation: { },
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    SeriesName: {
        label: 'Series:',
        classNameCustom:'SeriesName',
        elementType:'input', 
        elementConfig:{
            type: 'text',
            placeholder: 'Series the fanfic part of'
        },
        value:'',
        validation: { },
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    SeriesNumber: {
        label: 'SeriesNumber:',
        classNameCustom:'SeriesNumber',
        elementType:'input', 
        elementConfig:{
            type: 'number',
            placeholder: 'The number of the fanfic in the series (part XXX)'
        },
        value:'',
        validation: { },
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    Categories: {
        label: 'Categories:',
        classNameCustom:'Categories',
        elementType:'auto-select', 
        elementConfig:{
            suggestions:  categories,
            placeholder: 'Select Categories'
        },
        value:[],
        validation: { },
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    Summary: {
        label: 'Summary:',
        classNameCustom:'Summary',
        elementType:'textarea', 
        elementConfig:{
            type: 'text',
            placeholder: '(*) Summary'
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
    Source: {
        label: '(*) Source',
        classNameCustom:'Source',
        elementType:'select', 
        elementConfig:{
            options: [
                        {value: 'Backup',displayValue: 'Backup'},
                        {value: 'Patreon',displayValue: 'Patreon'},
                        {value: 'Tumblr',displayValue: 'Tumblr'},
                        {value: 'Wattpad',displayValue: 'Wattpad'}
                      ]
        },
        value:'',
        validation: {
            required: true
        },
        valid: false,
        visible: true,
        disabled:false
    },
    PublishDate: {
        label: '(*) Publish Date',
        classNameCustom:'PublishDate',
        elementType:'date', 
        value:'',
        validation:{},
        valid: true,
        visible: true,
        disabled:false
    },
    UpdateDate: {
        label: '(*) Update Date',
        classNameCustom:'UpdateDate',
        elementType:'date', 
        value:'',
        validation:{},
        valid: true,
        visible: true,
        disabled:false
    },
    Language: {
        label: 'Language',
        classNameCustom:'Language',
        elementType:'select', 
        elementConfig:{
            options: [
                        {value: 'English',displayValue: 'English'},
                      ]
        },
        value:'',
        validation:{},
        valid: true,
        visible: true,
        disabled:false
    },
    Words: {
        label: '(*) Words:',
        classNameCustom:'Words',
        elementType:'input', 
        elementConfig:{
            type: 'number',
            placeholder: '(*) Words'
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
        label: '(*) Chapters:',
        classNameCustom:'NumberOfChapters',
        elementType:'input', 
        elementConfig:{
            type: 'number',
            placeholder: '(*) Chapters'
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
        label: '(*) Complete',
        classNameCustom:'Complete',
        elementType:'select', 
        elementConfig:{
            options: [{value: false,displayValue: 'No'},
                      {value: true,displayValue: 'Yes'}
                      ]
        },
        value:'',
        validation: {
            required: true
        },
        valid: false,
        visible: true,
        disabled:false
    },
    Oneshot: {
        label: 'Oneshot',
        classNameCustom:'Oneshot',
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
    Comments: {
        label: 'Comments (Reviews):',
        classNameCustom:'Comments',
        elementType:'input', 
        elementConfig:{
            type: 'number',
            placeholder: 'Comments (Reviews)'
        },
        value:'',
        validation: {},
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    Kudos: {
        label: 'Kudos (Favs)',
        classNameCustom:'Kudos',
        elementType:'input', 
        elementConfig:{
            type: 'number',
            placeholder: 'Kudos (Favs)'
        },
        value:'',
        validation: {},
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    Hits: {
        label: 'Hits:',
        classNameCustom:'Hits',
        elementType:'input', 
        elementConfig:{
            type: 'number',
            placeholder: 'Hits'
        },
        value:'',
        validation: {},
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    },
    Bookmarks: {
        label: 'Bookmarks (Follows):',
        classNameCustom:'Bookmarks',
        elementType:'input', 
        elementConfig:{
            type: 'number',
            placeholder: 'Bookmarks (Follows)'
        },
        value:'',
        validation: {},
        valid:true,
        touched:false,
        visible: true,
        disabled:false
    }
}]