import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
      primary: { main: purple[500] }, // Purple and green play nicely together.
      secondary: { main: '#11cb5f' }, // This is just green.A700 as hex.
    },
    typography: {
        fontFamily: [
            'Libre Baskerville',
            'Roboto',
            'serif',
            'sans-serif'
        ].join(','),
    },
    test: {
        color: 'yellow'
    }
  });

responsiveFontSizes(theme);

export default theme