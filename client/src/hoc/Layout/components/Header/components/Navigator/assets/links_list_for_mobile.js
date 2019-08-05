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
                link: '/myFandoms',                
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
                label: 'AO3 Downloader',       
                link: '/ao3Downloader',                
            },
            {
                label: 'Other Sites Downloader',       
                link: '/otherSitesDownloder',                
            },
                     
        ]
    }
]