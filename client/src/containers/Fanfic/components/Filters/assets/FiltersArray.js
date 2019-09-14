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
            name:   'follow',
            display: 'Follow'
        },
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
            type :      'checkbox',
            name:       'ignore',
            display:    'Ignore'
        },{
            type :      'checkbox',
            name:       'noUserData',
            display:    "New (Didn't marked yet)"
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
    ],
    Source:[
        {
            type : 'checkbox',
            name:  'all',
            display: 'All'
        },{
            type : 'checkbox',
            name:  'ao3',
            display: 'AO3'
        },{
            type : 'checkbox',
            name: 'ff',
            display: 'FF'
        },{
            type : 'checkbox',
            name: 'backup',
            display: 'Backup'
        }
    ]
}

export const filtersArrayInit = {
    complete:false,
    wip:false,
    oneShot:false,
    deleted:false,

    follow:false,
    favorite:false,
    finished:false,
    inProgress:false,
    ignore:false,
    noUserData:false,
    
    bookmarks:false,
    comments:false,
    dateLastUpdate:false,
    publishDate:false,
    hits:false,
    kudos:false,

    categories:[],
    
    currentSort:'dateLastUpdate',
    currentSource:'all'
}

export const filtersArrayAttr = {
    complete:false,
    wip:false,
    oneShot:false,
    deleted:false,

    follow:false,
    favorite:false,
    finished:false,
    inProgress:false,
    ignore:false,
    
    bookmarks:false,
    comments:false,
    dateLastUpdate:false,
    publishDate:false,
    hits:false,
    kudos:false,

    author:"",
    wordsFrom:"",
    wordsTo:"",
    title:"",
    fanficId:"",

    categories:[],
    
    currentSort:'dateLastUpdate',
    currentSource:'all'
}


