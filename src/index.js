import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import populateReducer from './data/redux/reducers/populateReducer';
import resourceReducer from './data/redux/reducers/resourceReducer';
import 'bootstrap/dist/css/bootstrap.min.css';


// Defining additional reducers if there is need for
const rootReducer = combineReducers({
  populateReducer: populateReducer,
  resourceReducer: resourceReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
registerServiceWorker();
