export const filtersArray = {
    Fanfic:[
        {
            type : 'checkbox',
            name:  'complete',
            display: 'Complete'
        },{
            type : 'checkbox',
            name:  'wip',
            display: 'Work in Progress'
        },{
            type : 'checkbox',
            name:  'oneShot',
            display: 'One Shot'
        },{
            type : 'checkbox',
            name:   'deleted',
            display: 'Deleted (Archive)'
        }
    ],
    UserData:[
        {
            type : 'checkbox',
            name:   'favorite',
            display: 'Favorite'
        },
        {
            type : 'checkbox',
            name:   'finished',
            display: 'Finished'
        },
        {
            type : 'checkbox',
            name:   'inProgress',
            display: 'In Progress'
        },
        {
            type : 'checkbox',
            name:   'ignore',
            display: 'Ignore'
        }
    ],
    Sort:[
        {
            type : 'checkbox',
            name:  'dateLastUpdate',
            display: 'Update Date'
        },{
            type : 'checkbox',
            name: 'publishDate',
            display: 'Publish Date'
        },{
            type : 'checkbox',
            name:  'authorSort',
            display: 'Author'
        },{
            type : 'checkbox',
            name:  'titleSort',
            display: 'Title'
        },{
            type : 'checkbox',
            name:  'hits',
            display: 'Hits'
        },{
            type : 'checkbox',
            name:  'kudos',
            display: 'Kudos'
        },{
            type : 'checkbox',
            name:  'bookmarks',
            display: 'Bookmarks'
        },{
            type : 'checkbox',
            name:  'comments',
            display: 'Comments'
        }
    ]
}

export const filtersArrayInit = {
    complete:false,
    wip:false,
    oneShot:false,
    deleted:false,

    favorite:false,
    finished:false,
    inProgress:false,
    ignore:false,
    
    author:"",
    bookmarks:false,
    comments:false,
    dateLastUpdate:false,
    publishDate:false,
    hits:false,
    kudos:false,
    wordsFrom:"",
    wordsTo:"",
    title:"",
}


