import * as Redux from "redux";
import appReducer from "./appReduxer";
import {applyMiddleware} from "redux";
import thunk from "redux-thunk";



let rootReducer = Redux.combineReducers({
  app: appReducer
})

let store = Redux.createStore(rootReducer, applyMiddleware(thunk))

export default store