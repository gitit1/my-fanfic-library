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
        },{
            type : 'checkbox',
            name:  'hasImage',
            display: 'Has Image',
            manager: true
        },{
            type : 'checkbox',
            name:  'noImage',
            display: 'Without Image',
            manager: true
        },{
            type : 'checkbox',
            name:  'hasCategories',
            display: 'Has Categories',
            manager: true
        },{
            type : 'checkbox',
            name:  'noCategories',
            display: 'Without Categories',
            manager: true
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
            name: 'uploadDate',
            display: 'Upload Date'
        },{
            type : 'checkbox',
            name: 'readingDate',
            display: 'Reading Date'
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
            name: 'backup',
            display: 'Backup'
        },{
            type : 'checkbox',
            name: 'ff',
            display: 'FF'
        },{
            type : 'checkbox',
            name: 'patreon',
            display: 'Patreon'
        },{
            type : 'checkbox',
            name: 'tumblr',
            display: 'Tumblr'
        },{
            type : 'checkbox',
            name: 'wattpad',
            display: 'Wattpad'
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
    hasImage:false,
    noImage:false,
    hasCategories:false,
    noCategories:false,
    noUserData:false,
    
    bookmarks:false,
    comments:false,
    dateLastUpdate:false,
    publishDate:false,
    uploadDate:false,
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
    hasImage:false,
    noImage:false,
    hasCategories:false,
    noCategories:false,
    noUserData:false,
    
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


