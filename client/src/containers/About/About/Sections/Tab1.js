import React from 'react';
import Container from '../../../../components/UI/Container/Container';

const Tab1 = () => (
    <Container header='Why did I built the site?'>
          <section className='Tab1'>
            <p>I choose to built this site because I really love to read fanfics but I have a couple of issues with the sites I'm reading my fanfics from:</p>
            <h4>General Issues</h4>
            <ul>
              <li>Create one plave that will contain all of the fanfics I read (fanfic data + fanfic file for backup) - will include AO3,FF,Wattpad,Tumblr,Patreon and even others</li>
              <li>Create user buttons (Follow,Finished,Ignore...) which are easy to understand and use (and see them during search)</li>
              <li>Backup all the fanfics <strong>Automaticlly</strong></li>
              <li>have statistics about my reading</li>
              <li>follow fanfics without getting email everytime it got update</li>
              <li>ignore fanfics that I know I'm not gonna read - so I won't see them on my search</li>
            </ul>
            <h4><a href="https://archiveofourown.org/">AO3</a></h4>
            <ul>
              <li>My Main problem is that while searching for a fanfic I can't know if I already read it or not , only by bookmatk (after entering the fanfic page) and in bookmark by special tags</li>
              <li>The site design is too "old" even thougth its the most comptable to read fanfics like that , I still want to see images</li>
              <li>I don't care about all the fandoms in the world just specific (and gay...)</li>
              <li>There are a lot of fanfics that got deletd from site and I want to have a backup for them</li>
            </ul>
            <h4><a href="https://www.fanfiction.net/">FF</a></h4>
            <ul>
              <li>I only read there very little fanfics so I want to follow them and see them in one place with my other fanfics</li>
              <li>Check if they already exist in ao3 so maybe I already read them</li>
            </ul>
            <h4><a href="https://www.wattpad.com/home">Wattpad</a></h4>
            <ul>
              <li>I only read there very little fanfics so I want to follow them and see them in one place with my other fanfics</li>
              <li>The design of the site is way better but it so uncomptable to read there the stories - I want to save them as epun/pdf... and them  read</li>
            </ul>
            <h4><a href="https://www.wattpad.com/home">Tumblr/Patreon</a></h4>
            <ul>
              <li>I only read there very little fanfics so I want to follow them and see them in one place with my other fanfics</li>
              <li>There are a lot of short stories there - I want to save them to one place and as epub/pdf...</li>
            </ul>
          </section>
    </Container>
);

export default Tab1;