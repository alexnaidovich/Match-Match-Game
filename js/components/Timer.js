class Timer {
  constructor() {
    this.field = document.querySelector('#timer');
    this.minutes = 0;
    this.seconds = 0;
    this.passedSeconds = 0; // ?????
  }
  
  addZero(value) {    
    return "0" + String(value);    
  }
  
  write(mins, secs) {
    mins = String(mins);
    secs = secs < 10 ? this.addZero(secs) : String(secs);
    this.field.innerText = mins + ":" + secs;
  }
  
  process() {
    let s = this.seconds, 
        m = this.minutes,
        p = this.passedSeconds;  // ?????
    let tick = setInterval(() => {
      s++;
      p++;
      global__currentGameSeconds = p;
      
      if (s > 59) {
        m++;
        s = 0;
      }
      
      this.write(m, s);
      
      if (global__gameOver) {
        this.passedSeconds = p;  // ?????
        clearInterval(tick);
      }
      
    }, 1000);
  }
}