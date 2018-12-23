class Wave {
  constructor(canvas, color){
    this.canvas = canvas;
    this.color = color;
    this.init();
  };
  
  init(){
    this.params = {
      AMPLITUDE_WAVES: this.canvas.height,
      AMPLITUDE_MIDDLE: this.canvas.height / 2,
      AMPLITUDE_SIDES: this.canvas.height/2,
      OFFSET_SPEED: 160,
      SPEED: 4,
      OFFSET_WAVES: 16,
      NUMBER_WAVES: 3,
      NUMBER_CURVES: 3,
      OFFSET_CURVE: true,
      RESET: false
    }
    this.speedInc = 0;
  }

  render() {

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    let ctx = this.canvas.getContext('2d');
    let params = this.params;
    // For each wave
    for (let j =0; j >= 0; j--) {
      // offset between waves
      let offset = this.speedInc + j * Math.PI * params.OFFSET_WAVES;

      // Color and increase gradually opacity

      // ctx.globalAlpha = wavesOpacities[j];


      // Oscillations
      // Define heights cubicBezier amplitudes

      // Speed amplitude variation between 0 and AMPLITUDE_SIDES ( half height window)
      // Set height amplitude of borders points (left and right of the window) -> no offset here
      let leftRange = ((Math.sin((offset / params.OFFSET_SPEED) + 2) + 1) / 3 * params.AMPLITUDE_SIDES) + (this.canvas.height*0.75 - params.AMPLITUDE_SIDES) / 2;
      let rightRange = ((Math.sin((offset / params.OFFSET_SPEED) + 2) + 1) / 2 * params.AMPLITUDE_SIDES) + (this.canvas.height*0.75 - params.AMPLITUDE_SIDES) / 2;

      // Speed amplitude variation between 0 and AMPLITUDE_WAVES ( height window)
      // Set height amplitude of the first and second points of a curve
      let leftCurveRange = (Math.sin((offset / params.OFFSET_SPEED) + 2) + 1) / 2 * params.AMPLITUDE_WAVES + (this.canvas.height*0.75 - params.AMPLITUDE_WAVES) / 2;
      let rightCurveRange = (Math.sin((offset / params.OFFSET_SPEED) + 1) + 1) / 2 * params.AMPLITUDE_WAVES + (this.canvas.height*0.75 - params.AMPLITUDE_WAVES) / 2;

      // Speed amplitude variation between 0 and AMPLITUDE_MIDDLE
      // Set height amplitude of the last point of a curve
      let endCurveRange = ((Math.sin((offset / params.OFFSET_SPEED) + 2) + 1) / 2 * params.AMPLITUDE_MIDDLE) + (this.canvas.height*0.75 - params.AMPLITUDE_MIDDLE) / 2;

      // Reverse amplitude of the first and second points of a curve (only needed with 3 curves or more)
      let reverseLeftCurveRange = endCurveRange - rightCurveRange + endCurveRange;
      let reverseRightCurveRange = endCurveRange - leftCurveRange + endCurveRange;

      // Neutralise curves first and second point amplitude
      if (params.OFFSET_CURVE === false) {

        leftCurveRange = rightCurveRange;
        reverseRightCurveRange = reverseLeftCurveRange;

      }


      // Draw and fill path
      ctx.beginPath();

      // Draw first point from Left
      ctx.moveTo(0, leftRange);

      // Draw bezier curves based on amplitude

      // Draw each points of the first curve
      // bezierCurveTo() see https://www.w3schools.com/TAGs/this.canvas_beziercurveto.asp
      ctx.bezierCurveTo(this.canvas.width / (params.NUMBER_CURVES * 3), leftCurveRange, this.canvas.width / (params.NUMBER_CURVES * 3 / 2), rightCurveRange, this.canvas.width / params.NUMBER_CURVES, endCurveRange);

      // Draw each points of other curves if needed
      for (let i = 1; i < params.NUMBER_CURVES; i++) {
        
        // Reverse waves amplitude 1 / 2 times
        const finalRightCurveRange = i % 2 !== 0 ? rightCurveRange : reverseRightCurveRange;
        const finalLeftCurveRange = i % 2 !== 0 ? leftCurveRange : reverseLeftCurveRange;

        // Set points curve
        const secondPtX = this.canvas.width * (i / params.NUMBER_CURVES) + this.canvas.width / (params.NUMBER_CURVES * 3);
        const secondPtY = endCurveRange - finalRightCurveRange + endCurveRange;
        const thirdPtX = this.canvas.width * (i / params.NUMBER_CURVES) + this.canvas.width * (2 / (params.NUMBER_CURVES * 3));
        const thirdPtY = endCurveRange - finalLeftCurveRange + endCurveRange;
        const lastPtX = this.canvas.width * ((i + 1) / params.NUMBER_CURVES);
        const lastPtY = i === params.NUMBER_CURVES - 1 ? rightRange : endCurveRange;
        
        ctx.bezierCurveTo(secondPtX, secondPtY, thirdPtX, thirdPtY, lastPtX, lastPtY);

      }

      // Draw last lines

      ctx.lineTo(this.canvas.width, this.canvas.height);
      ctx.lineTo(0, this.canvas.height);
      ctx.lineTo(0, rightRange);
      ctx.fillStyle = this.color;
      ctx.closePath();
      ctx.fill();
    }

    // Speed
    this.speedInc += params.SPEED;
  };
};

document.addEventListener("DOMContentLoaded", function(){

  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
    window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  let bg = {
    initFunc : function(){
      // get width window & some 
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;
      this.myCanvas = document.querySelector('#Background-Canvas'),
      this.ctx = this.myCanvas.getContext('2d');
      this.ctx.globalCompositeOperation = "source-over";
      // this.myCanvas.width = windowWidth;
      //
      // define color for waves
      // this.grd1 = this.ctx.createLinearGradient(0, 0, this.myCanvas.width, this.myCanvas.height);
      this.grd1=this.ctx.createLinearGradient(1140.0 * windowWidth / 1280.0, windowHeight, 1260.0*windowWidth/1280.0, 74.0 * windowHeight/728.0);
      
      // this.grd1.addColorStop(0,"#181a3a");
      // this.grd1.addColorStop(0.5, '#231E4F');
      // this.grd1.addColorStop(1, '#271E4A');
      this.grd1.addColorStop(0,"#181a3a");
      this.grd1.addColorStop(0.5,"rgba(161, 68, 207, 0.63)");
      this.grd1.addColorStop(1,"#3023AE");
      this.timeNow = this.timeExecute = new Date().getTime();
    },
    drawFunc : function(){
      this.timeNow = new Date().getTime();
      if (this.timeNow - this.timeExecute >=30) {
        this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
        this.wave1.render();
        this.timeExecute = this.timeNow;
      };
      window.requestAnimationFrame(this.drawFunc);
    },
    start : function(){
      this.initFunc = this.initFunc.bind(this);
      this.drawFunc = this.drawFunc.bind(this);
      
      let t = new Promise((resolve, reject)=>{
        this.initFunc();
        this.wave1 = new Wave(this.myCanvas, this.grd1);
        resolve();
      });
      t.then(()=>{
        this.drawFunc();
      })
    }
  }

  bg.start();
})