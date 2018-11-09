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

export default Wave;
