var vendors = ['ms', 'moz', 'webkit', 'o'];
class Wave {
    constructor(type, posY, A, opacity, canvas, ctx, color){
        this.init();
        this.time = 0,

        this.canvas = canvas;
        this.ctx = ctx;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.posY = posY; // vi tri tinh tu bottom
        this.type = type; // "1", "2", "3" //xac dinh loai song
        this.color = color; // color wave
        this.A = A; // bien do
        this.draw = this.draw.bind(this);
        this.lamda = 650;
        this.l = 500;

        if (type === "1") {
            this.WaveFunc = (A, x, t)=> 2*A*Math.sin(2*Math.PI*x/this.lamda)*Math.cos(2*Math.PI*t + Math.sin(x/29 + this.lamda/A) + 2*Math.PI*(A/this.lamda));
        } else if(type === "2") {
            this.WaveFunc = (A, x, t)=> 2*A*Math.cos(2*Math.PI*x/this.lamda)*Math.cos(2*Math.PI*t + Math.sin(x/45 + this.lamda) + Math.PI/4);
        } else this.WaveFunc = (A, x, t)=> 2*A*Math.cos(2*Math.PI*x/this.lamda)*Math.cos(2*Math.PI*t + Math.sin(x/A + t - this.l*this.lamda/A) + 2*Math.PI/3);
    };
    
    init(){
        this.x = 0;
        this.y = 0;
        this.xo = 0;
        this.yo = 0;
        this.x_step = this.width/375;
        this.timeExecute = 0;
        this.time_step = 1/3600;
    }

    draw(){ 
        this.ctx.beginPath();
        this.ctx.translate(0, this.height - this.posY);
        this.ctx.fillStyle = this.color;
        this.ctx.moveTo(this.x0, this.y0);
        for(var i = 0;i<this.width;i+=this.x_step) {
            this.x = i + this.x_step;
            this.y = this.WaveFunc(this.A, this.x, this.time) ;
            this.time += this.time_step;
            this.ctx.lineTo(this.x, this.y);

            this.xo = this.x;
            this.yo = this.y;
        }

        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.fill();

        this.init();
        this.ctx.translate(0, -this.height + this.posY);
    };
};

for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {

    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];

    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||

    window[vendors[x]+'CancelRequestAnimationFrame'];
}

let bg = {
    initFunc : function(){
        // get width window & some 
        let windowWidth = window.innerWidth,
        windowHeight = window.innerHeight;
        this.myCanvas = document.querySelector('#Background-Canvas'),
        this.ctx = this.myCanvas.getContext('2d');
        this.ctx.globalCompositeOperation = "source-over";
        this.myCanvas.width = windowWidth;
        this.myCanvas.height = windowHeight;

        // define color for waves
        this.grd1=this.ctx.createLinearGradient(0,0,this.myCanvas.width/2,0);
        this.grd2=this.ctx.createLinearGradient(0,0,2*this.myCanvas.width/3,0);
        this.grd3=this.ctx.createLinearGradient(0,0,this.myCanvas.width/2,0);
        
        this.grd1.addColorStop(0,"#7f49a6");
        this.grd1.addColorStop(1,"#df4d7c");

        this.grd2.addColorStop(0,"#734297");
        this.grd2.addColorStop(1,"#c24472");

        this.grd3.addColorStop(0,"#563275");
        this.grd3.addColorStop(1,"#86315c");

        this.timeNow = this.timeExecute = new Date().getTime();
    },

    drawFunc : function(){
        this.timeNow = new Date().getTime();
        if (this.timeNow - this.timeExecute >=150) {
            this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
            this.c.draw();
            this.b.draw();
            this.wave1.draw();
            this.timeExecute = this.timeNow;
        };
        window.requestAnimationFrame(this.drawFunc);
    },

    start : function(){
        this.initFunc = this.initFunc.bind(this);
        this.drawFunc = this.drawFunc.bind(this);
        
        let t = new Promise((resolve, reject)=>{
            this.initFunc();
            this.wave1 = new Wave("1", 170, 35, 0.2, this.myCanvas, this.ctx, this.grd1);
            this.b = new Wave("2", 190, 40, 0.2, this.myCanvas, this.ctx, this.grd2);
            this.c = new Wave("3", 180, 35, 0.3, this.myCanvas, this.ctx, this.grd3);
            resolve();
        });

        t.then(()=>{
            this.drawFunc();
        })
    }
}

bg.start();
