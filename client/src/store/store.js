import { createStore, applyMiddleware, compose , combineReducers } from 'redux';
import thunk from 'redux-thunk';
import fandomsReducer from './reducers/fandomsReducer';
import downloderReducer from './reducers/downloaderReducer';
import updatesReducer from './reducers/updatesReducer';
import fanficsReducer from './reducers/fanficsReducer';
import usersReducer from './reducers/usersReducer';
import sizeReducer from './reducers/sizeReducer';

let composeEnhancers = null;
if (process.env.NODE_ENV === 'development') {
   composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
   composeEnhancers = compose;
}

const rootReducer = combineReducers({
    fandoms:            fandomsReducer,
    fanfics:            fanficsReducer,
    downloader:         downloderReducer,
    updates:            updatesReducer,
    auth:               usersReducer,
    screenSize:         sizeReducer
});

const store = createStore(rootReducer,composeEnhancers(
    applyMiddleware(thunk)
));


export default store;
