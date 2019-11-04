const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const body = document.querySelector("body"); 
let w = {w:body.clientHeight,h:body.clientWidth}; // height and width of canvas
let scale = {x:2,y:2}; // scale for how much can be seen in each cardinal direction whole numbers ideal and x should == y
let markL = 10; // tick lengths showing the x and y values in px
let n = 1; // x^n = 1 solutions
const fps = 60;
let fontsize = 20; // in px
let triangleT = false;

function setup() {
    // sets up canvas
    ctx.save();
    // always square
    w = {h:body.clientHeight,w:body.clientHeight};
    c.width = w.w;
    c.height = w.h;
    ctx.translate(w.w/2,w.h/2);
    ctx.scale(1,-1);
    window.onresize = (ev)=> {
        ctx.restore();
        w = {h:body.clientHeight,w:body.clientHeight};
        c.width = w.w;
        c.height = w.h;
        ctx.translate(w.w/2,w.h/2);
        ctx.scale(1,-1);
        // sets up side bar
        document.getElementById("side-bar").style.width = (body.clientWidth - w.w) - 25+"px"; // -5 because of border and padding
    }
    // sets up side bar
    document.getElementById("side-bar").style.width = (body.clientWidth - w.w) - 25+"px"; // -5 because of border and padding
    // document.getElementById("side-bar").textContent = "hi how are you doing you absolute piece of crap";
    // sets up toggle triangles
    requestAnimationFrame(draw);
}

// the drawing's pov will always be focused on origin

function draw() {
    //limits kinda to fps
    setTimeout(()=> {
        requestAnimationFrame(draw);
    },1000/fps)
    ctx.clearRect(-w.w/2,-w.h/2,w.w,w.h);
    ctx.font = fontsize + "px Arial"
    ctx.strokeStyle = "black";
    ctx.lineWidth = "3px";
    //clearly labels axes
    ctx.moveTo(0,-w.h/2);
    ctx.lineTo(0,w.h/2);
    ctx.stroke();
    ctx.moveTo(-w.w/2, 0);
    ctx.lineTo(w.w/2, 0)
    ctx.stroke();
    for (let i=0;i <= 2*scale.y; i++) {
        let width = (-w.w/2) + (i*(w.w/(scale.x*2)));
        let height = (-w.h/2) + (i*(w.h/(scale.y*2)));
        if (width != 0) {
            ctx.moveTo(-markL/2,height);
            ctx.lineTo(markL/2,height);
            ctx.stroke();
            ctx.scale(1,-1);
            ctx.fillText((Math.abs(-scale.y + i) == 1) ? + (-scale.y + i > 0) ? "-i" : "i": -scale.y + i + "i",markL/2,(height <= 0) ? height+fontsize : height - 5); // some arbitrary pixel shifts for aesthetic
            ctx.scale(1,-1);
        }
        ctx.moveTo(width, -markL/2);
        ctx.lineTo(width, markL/2);
        ctx.stroke();
        ctx.scale(1,-1);
        ctx.fillText(-scale.x + i,(width <= 0) ? width + 5 : width - 15, fontsize + 5); // some arbitrary pixel shifts for aesthetic
        ctx.scale(1,-1);
        ctx.closePath();
    }
    ctx.lineWidth = "1px";
    // draws unit circle
    ctx.beginPath();
    ctx.arc(0,0,w.w/(scale.x*2),0,2*Math.PI)
    ctx.stroke();
    // plots points on unit circle
    n = Number(document.getElementById("n-input").value);
    for (let i=0; i < n; i++) {
        let a = i*(2*Math.PI/n); // angle
        // plots point
        ctx.beginPath();
        ctx.arc(Math.cos(a)*(w.w/(scale.x*2)),Math.sin(a)*(w.h/(scale.y*2)),3,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.scale(1,-1);
        ctx.scale(1,-1);
        ctx.lineWidth = "1px";
        if (triangleT == true && n != 2 && n!= 1) {
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(Math.cos(a)*(w.w/(scale.x*2)),Math.sin(a)*(w.h/(scale.y*2)));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(Math.cos(a)*(w.w/(scale.x*2)),Math.sin(a)*(w.h/(scale.y*2)))
            ctx.lineTo(Math.cos(a)*(w.w/(scale.x*2)),0);
            ctx.closePath();
            ctx.stroke();
            let sign = (n%1 != 0) ? 1: -1;
            ctx.strokeRect(
                Math.cos(a)*(w.w/(scale.x*2)),
                0,
                sign * Math.sign(Math.cos(a)*(w.w/(scale.x*2)))*10,
                sign * Math.sign(Math.sin(a)*(w.h/(scale.y*2)))*10
                )
        }
    }
}

setup();