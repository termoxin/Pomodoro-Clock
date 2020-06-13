import * as Redux from "redux";
import appReducer from "./appReduxer";
import {applyMiddleware} from "redux";
import thunk from "redux-thunk";

export default Redux.createStore(appReducer, applyMiddleware(thunk))