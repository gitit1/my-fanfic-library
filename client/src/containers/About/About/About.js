import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import  './About.scss';
import Tab0 from './Sections/Tab0'
import Tab1 from './Sections/Tab1'
import Tab2 from './Sections/Tab2'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


const About = () => {
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return(
    // 
      <div className='About'>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className='Tabs'
        >
          <Tab label="How I built the site?" {...a11yProps(0)} />
          <Tab label="Why built the site?" {...a11yProps(1)} />
          <Tab label="Funcionality" {...a11yProps(2)} />
        </Tabs>

        <TabPanel value={value} index={0}><Tab0 /></TabPanel>
        <TabPanel value={value} index={1}><Tab1 /></TabPanel>
        <TabPanel value={value} index={2}><Tab2 /></TabPanel>
      </div>
    // </Container>

  )
};

export default About;