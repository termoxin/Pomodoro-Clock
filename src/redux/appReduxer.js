import {getFormate} from "../utils.js";

const ADD_SESSION_LENGTH = 'ADD_SESSION_LENGTH'
const ADD_BREAK_LENGTH = 'ADD_BREAK_LENGTH'
const RESET = 'RESET'
const START_TIMER = 'START_TIMER'
const TIME_REDUCTION = 'TIME_REDUCTION'
const PAUSE_TIMER = 'PAUSE_TIMER';

let initalizeState = {
  breakLength: 5,
  sessionLength: 25,
  currentTimeSession: 1500,
  currentTimeBreak: 300,
  isProcess: false,
  timerId: '',
  currentMode: 'session'
}
document.title = 'Pomodoro Clock'

let appReducer = (state = initalizeState, action) => {
  switch (action.type) {
    case ADD_SESSION_LENGTH: {
      if (state.sessionLength > 1 && action.min < 0 || state.sessionLength < 60 && action.min > 0) {
        return {
          ...state,
          sessionLength: state.sessionLength + action.min,
          currentTimeSession: (state.sessionLength + action.min) * 60
        }
      }
      return state;
    }
    
    case ADD_BREAK_LENGTH: {
      if (state.breakLength > 1 && action.min < 0 || state.breakLength < 60 && action.min > 0) {
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
        return {
          ...initalizeState
        }
    }
    
    case TIME_REDUCTION: {
      if (state.currentMode === 'session') {
        // SESSION
        document.title = `Session: ${getFormate(state.currentTimeSession - 1)}`
        debugger
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

export let changeSessionLength = (isProcess) => dispatch => {
  if (!isProcess) {
    dispatch(isProcess())
  }
}

export let addSessionLength = (direction) => {
  let min = direction === 'Up' ? 1 : -1;
  return {
    type: ADD_SESSION_LENGTH,
    min
  }
}


export let addBreakLength = (direction) => {
  let min = direction === 'Up' ? 1 : -1;
  return {
    type: ADD_BREAK_LENGTH,
    min
  }
}

export let reset = () => ({
  type: RESET
})

export let startStopTimer = (status) => dispatch => {
  if (status === 'Start') {
    let userId = setInterval(() => {
      dispatch(timeReduction())
    }, 1000)
    dispatch(startTimer(true, userId));
  } else {
    dispatch(pauseTime())
  }
}

export let timeReduction = () => {
  return {
    type: TIME_REDUCTION
  }
}

export let startTimer = (status, timerId) => ({
  type: START_TIMER,
  status,
  timerId
})

export let pauseTime = () => ({
  type: PAUSE_TIMER
})

export default appReducer