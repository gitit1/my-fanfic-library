export const filtersArray = {
    Search:[
        {
            type : 'input',
            name:   'author_search',
            display: 'Author',
        },{
            type : 'input',
            name:  'title_search',
            display: 'Title'
        }
    ],
    Fanfic:[
        {
            type : 'checkbox',
            name:   'deleted',
            display: 'Deleted (Archive)'
        },{
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
        }
    ],
    UserData:[
        {
            type : 'checkbox',
            name:   'favorite',
            display: 'Favorite'
        }
    ],
    Sort:[
        {
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
    hits:false,
    kudos:false,
    bookmarks:false,
    comments:false,
    oneShot:false,
    wip:false,
    complete:false,
    deleted:false,
    favorite:false,
    wordsFrom:"",
    wordsTo:"",
    title:"",
    author:""
}


