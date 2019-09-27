export const navLinks = [
    {
        type: 'mobile',
        auth: false,
        label: 'Fandoms',
        list:[
            {      
                label: 'Fandoms',
                link: '/fandoms',
            }             
        ]
    },{
        type: 'mobile',
        auth: false,
        label: 'Search',
        list:[
            {      
                label: 'Search',
                link: '/search',
            }             
        ]
    },{
        type: 'mobile',
        label: 'My Tracking',
        auth: true,
        list:[
            {
                label: 'My Dashboard',       
                link: '/dashboard',                
            },
            {
                label: 'Status Tracker',       
                link: '/myTracker',                
            },
            {
                label: 'Reading List',       
                link: '/readingList',                
            }           
        ]
    },{
        type: 'mobile',
        label: 'Manage',
        auth_manager: true,
        list:[
            {
                label: 'Fandoms',       
                link: '/manageFandoms',                
            },
            {
                label:  'Downloader',
                link:   '/manageDownloader'
            },
            {
                label:  'Add New Fanfic',
                link:   '/AddNewFanfic'
            }                     
        ]
    },{
        type: 'mobile',
        label: 'About',
        auth_manager: false,
        list:[
            {
                label:  'About',       
                link:   '/about',                
            },
            {
                label:  'Contact Us',
                link:   '/contact'
            },
            {
                label:  'Disclaimers',
                link:   '/disclaimers'
            },
            {
                label:  'News & Updates',
                link:   '/news'
            }  
        ]
    }
]