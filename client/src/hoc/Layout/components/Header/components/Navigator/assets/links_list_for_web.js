export const navLinks = [
    {
        type: 'button',
        label: 'Fandoms',
        link: '/fandoms',
        auth: false
    },{
        type: 'button',        
        label: 'Search',
        link: '/search',
        auth: false
    },{
        type: 'menu',
        label: 'My Tracking',
        ancorName: 'anchorTrack',
        auth: true,
        subLinks:[
            {
                label: 'My Dashboard',       
                link: '/dashboard',                
            },
            {
                label: 'Status Tracker',       
                link: '/myFandoms',                
            },
            {
                label: 'Reading List',       
                link: '/readingList',                
            }
        ]
    },{
        type: 'menu',
        label: 'Manage',
        ancorName: 'anchorManage',
        auth_manager: true,
        subLinks:[
            {
                label:  'Fandoms',       
                link:   '/manageFandoms',                
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
        type: 'menu',
        label: 'About',
        ancorName: 'anchorAbout',
        auth_manager: false,
        subLinks:[
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