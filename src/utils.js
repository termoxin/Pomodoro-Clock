export let addZero = num => {
  return num < 10 ? `0${num}` : num
}

export let getFormate = seconds => {
  let time = `${addZero(Math.floor(seconds / 60))}:${addZero(seconds % 60)}`
  return time;
}

