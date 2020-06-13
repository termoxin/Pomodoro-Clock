import {getFormate} from "../utils.js";

const ADD_SESSION_LENGTH = 'ADD_SESSION_LENGTH'
const ADD_BREAK_LENGTH = 'ADD_BREAK_LENGTH'
const RESET = 'RESET'
const START_TIMER = 'START_TIMER'
const TIME_REDUCTION = 'TIME_REDUCTION'
const PAUSE_TIMER = 'PAUSE_TIMER';

let initializationState = {
  breakLength: 5,
  sessionLength: 25,
  currentTimeSession: 1500,
  currentTimeBreak: 300,
  isProcess: false,
  timerId: null,
  currentMode: 'session'
}
document.title = 'Pomodoro Clock'

export default (state = initializationState, action) => {
  switch (action.type) {
    case ADD_SESSION_LENGTH: {
      if (
        ((state.sessionLength > 1 && action.min < 0)|| (state.sessionLength < 60 && action.min > 0))
        && !state.isProcess) {
        return {
          ...state,
          sessionLength: state.sessionLength + action.min,
          currentTimeSession: (state.sessionLength + action.min) * 60
        }
      }
      return state;
    }
    
    case ADD_BREAK_LENGTH: {
      if (
        ((state.breakLength > 1 && action.min < 0) || (state.breakLength < 60 && action.min > 0))
        && !state.isProcess) {
        return {
          ...state,
          breakLength: state.breakLength + action.min,
          currentTimeBreak: (state.breakLength + action.min) * 60
        }
      }
      return state;
    }
    
    case RESET: {
      document.title = 'Pomodoro Clock'
      clearTimeout(state.timerId)
      return {
        ...initializationState
      }
    }
    
    case TIME_REDUCTION: {
      if (state.currentMode === 'session') {
        // SESSION
        document.title = `Session: ${getFormate(state.currentTimeSession - 1)}`
        if (state.currentTimeSession === 1) {
          return {
            ...state,
            currentTimeSession: state.sessionLength * 60,
            currentMode: 'rest'
          }
        }
        return {
          ...state,
          currentTimeSession: state.currentTimeSession - 1
        }
        
      } else {
        // REST
        document.title = `Rest: ${getFormate(state.currentTimeBreak - 1)}`
        
        if (state.currentTimeBreak === 1) {
          return {
            ...state,
            currentTimeSession: state.currentTimeBreak * 60,
            currentMode: 'session'
          }
        }
        return {
          ...state,
          currentTimeBreak: state.currentTimeBreak - 1
        }
      }
    }
    
    case START_TIMER: {
      return {
        ...state,
        isProcess: true,
        timerId: action.timerId
      }
    }
    
    case PAUSE_TIMER: {
      document.title = 'Timer paused'
      clearTimeout(state.timerId)
      return {...state, isProcess: false}
    }
    
    default: {
      return state;
    }
  }
}

export let startStopTimer = (status) => dispatch => {
  if (status === 'Start') {
    let timerId = setInterval(() => {
      dispatch(timeReduction())
    }, 1000)
    dispatch(startTimer(timerId));
  } else {
    dispatch(pauseTime())
  }
}

export let addSessionLength = (direction) => ({type: ADD_SESSION_LENGTH, min: direction === 'Up' ? 1 : -1})
export let addBreakLength = (direction) => ({type: ADD_BREAK_LENGTH, min: direction === 'Up' ? 1 : -1})
export let reset = () => ({type: RESET})
export let timeReduction = () => ({type: TIME_REDUCTION})
export let startTimer = (timerId) => ({type: START_TIMER, timerId})
export let pauseTime = () => ({type: PAUSE_TIMER})