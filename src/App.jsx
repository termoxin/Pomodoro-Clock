import React from "react";
import './App.css'
import play from './access/paly.svg'
import pause from './access/pause.svg'
import resetTime from './access/time.svg'
import arrow from './access/arrow.svg'
import {connect} from "react-redux";
import {addBreakLength, addSessionLength, changeSessionLength, reset, startStopTimer} from "./redux/appReduxer";

let Setting = ({title, value, upWork, upRest, downWork, downRest, category}) => {
  let onUpArrow = () => {
    category === 'work' ? upWork() : upRest();
  }
  
  let onDownArrow = () => {
    let f = category === 'work' ? downWork : downRest;
    f();
  }
  return (
    <div className='setting'>
      <div className='settingTitle'>{title}</div>
      <div className='withArrows'>
        <img src={arrow} alt="upValue" onClick={onUpArrow} className="upValue"/>
        <div className='settingValue'>{value}</div>
        <img src={arrow} alt="downValue" onClick={onDownArrow} className="downValue"/>
      </div>
    </div>
  )
}

let ButtonWithSvg = ({svg, alt, onClick}) => {
  return <img className='buttonImg' onClick={onClick || null} src={svg} alt={alt}/>
}

let addZero = num => num < 10 ? `0${num}` : num
let getFormate = seconds => `${addZero(Math.floor(seconds / 60))}:${addZero(seconds % 60)}`

class App extends React.Component {
  render() {
    let {breakLength, sessionLength, currentTimeSession, currentTimeBreak, isProcess, currentMode} = this.props;
    let isRest = currentMode === 'rest';
    
      let currentTimeSessionMin = getFormate(currentTimeSession)
      let currentTimeRestMin = getFormate(currentTimeBreak)
    return (
      <div className='wrapper'>
        <div className="title">Pomodoro Clock</div>
        <div className='screen'>
          <div className="settings">
            <Setting title='Break Length' value={breakLength} upRest={this.props.upRest} downRest={this.props.downRest}/>
            <Setting title='Session Length' category='work' upWork={this.props.upWork} downWork={this.props.downWork} value={sessionLength}/>
          </div>
          
          <div className="visualInfo">
            <div className="titleInfo">{isRest ? 'Rest' : 'Session'}</div>
            <div className="time">{isRest ? currentTimeRestMin : currentTimeSessionMin}</div>
          </div>
          
          <div className="buttons">
            {isProcess
              ? <ButtonWithSvg svg={pause} alt='controlerProgress' onClick={this.props.pauseTimer}/>
              : <ButtonWithSvg svg={play} alt='controlerProgress' onClick={this.props.startTimer}/>}
            <ButtonWithSvg svg={resetTime} alt='restart' onClick={this.props.reset}/>
          </div>
        </div>
        <audio
          id="beep"
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
        />
      </div>
    )
  }
}

let mapStateToProp = state => ({
  breakLength: state.app.breakLength,
  sessionLength: state.app.sessionLength,
  currentTimeSession: state.app.currentTimeSession,
  currentTimeBreak: state.app.currentTimeBreak,
  isProcess: state.app.isProcess,
  currentMode: state.app.currentMode
})

let mapDispatchToProps = dispatch => ({
  changeSessionLength: (isProcess) => {
    dispatch(changeSessionLength(isProcess))
  },
  
  upWork: () => {
    dispatch(addSessionLength('Up'))
  },
  
  downWork: () => {
    dispatch(addSessionLength('Down'))
  },
  
  upRest: () => {
    dispatch(addBreakLength('Up'))
  },
  
  downRest: () => {
    dispatch(addBreakLength('Down'))
  },
  
  reset: () => {
    dispatch(reset());
  },
  
  startTimer: () => {
    dispatch(startStopTimer('Start'))
  },
  
  pauseTimer: () => {
    dispatch(startStopTimer('Pause'))
  }
})

export default connect(mapStateToProp, mapDispatchToProps)(App)