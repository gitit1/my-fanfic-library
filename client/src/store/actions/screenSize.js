
import * as actionTypes from './actionTypes';

const isDev = (process.env.NODE_ENV === 'development');

export const saveScreenSize = (size, smallSize) => {
    isDev && console.log('[actions: screenSize.js] - saveScreenSize')
    return {
        type: actionTypes.SAVE_SCREEN_SIZE,
        size: size,
        smallSize: smallSize
    };
};
