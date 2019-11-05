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
let label = false;
let circleT = false;
let res = 3;
let recorder = new CanvasRecorder(c);
let recording = false;
let colors = [];

function setup() {
    // sets up canvas
    ctx.save();
    // always square
    w = {h:body.clientHeight*res,w:body.clientHeight*res};
    c.width = w.w;
    c.height = w.h;
    c.style.width = `${w.w/res}px`;
    c.style.height = `${w.h/res}px`;
    ctx.translate(w.w/2,w.h/2);
    ctx.scale(1,-1);
    window.onresize = (ev)=> {
        ctx.restore();
        w = {h:body.clientHeight*res,w:body.clientHeight*res};
        c.width = w.w;
        c.height = w.h;
        c.style.width = `${w.w/res}px`;
        c.style.height = `${w.h/res}px`;
        ctx.translate(w.w/2,w.h/2);
        ctx.scale(1,-1);
        // sets up side bar
        document.getElementById("side-bar").style.width = (body.clientWidth - (w.w/res)) - 25+"px"; // -5 because of border and padding
    }
    // sets up side bar
    document.getElementById("side-bar").style.width = (body.clientWidth - (w.w/res)) - 25+"px"; // -5 because of border and padding
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
    if (recording == true) {
        ctx.fillStyle = "white";
        ctx.fillRect(-w.w/2,-w.h/2,w.w,w.h)
    } else {
        ctx.clearRect(-w.w/2,-w.h/2,w.w,w.h);
    }
    ctx.fillStyle = "black";
    ctx.font = (fontsize * res) + "px Helvetica"
    ctx.strokeStyle = "black";
    ctx.lineWidth = (1*res);
    //labels graph
    ctx.scale(1,-1);
    ctx.fillText(`x${toSuperScript(document.getElementById("n-input").value)} = 1`,(w.w/2) - ((50 + String(n).length*10)*res),-((w.h/2) - (20*res)));
    ctx.scale(1,-1);
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
            ctx.fillText((Math.abs(-scale.y + i) == 1) ? + (-scale.y + i > 0) ? "-i" : "i": -scale.y + i + "i",markL/2,(height <= 0) ? height+(fontsize * res) : height - 5); // some arbitrary pixel shifts for aesthetic
            ctx.scale(1,-1);
        }
        ctx.moveTo(width, -markL/2);
        ctx.lineTo(width, markL/2);
        ctx.stroke();
        ctx.scale(1,-1);
        ctx.fillText(-scale.x + i,(width <= 0) ? width + 5 : width - 15, (fontsize * res) + 5); // some arbitrary pixel shifts for aesthetic
        ctx.scale(1,-1);
        ctx.closePath();
    }
    ctx.lineWidth = (1*res);
    // draws unit circle
    if (circleT == false) {
        ctx.beginPath();
        ctx.arc(0,0,w.w/(scale.x*2),0,2*Math.PI)
        ctx.stroke();
    }
    // plots points on unit circle
    n = Number(document.getElementById("n-input").value);
    for (let i=0; i < n; i++) {
        let a = i*(2*Math.PI/n); // angle
        if (circleT == true) {
            ctx.beginPath();
            if (!colors[i]) {
                colors.push(randomColor());
            }
            ctx.strokeStyle = colors[i];
            ctx.arc(0,0,w.w/(scale.x*2),a,a+(2*Math.PI/n), false);
            ctx.stroke();
            // ctx.strokeStyle = "black";
        }
        // plots point
        ctx.beginPath();
        ctx.arc(Math.cos(a)*(w.w/(scale.x*2)),Math.sin(a)*(w.h/(scale.y*2)),3*res,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.scale(1,-1);
        ctx.scale(1,-1);
        ctx.lineWidth = (1*res);
        if (label == true) {
            let relFontSize = (fontsize * res) - ((Math.E*(n/100) < (fontsize * res - 3)) ? Math.E*(n/100) : (fontsize*res) - 3);
            ctx.scale(1,-1);
            ctx.font = `${relFontSize}px Arial`
            ctx.fillText(`(${Math.cos(a).toFixed(3)}, ${Math.sin(a).toFixed(3)}i)`,
            (Math.cos(a)*(w.w/(scale.x*2))>=0) ? Math.cos(a)*(w.w/(scale.x*2)): Math.cos(a)*(w.w/(scale.x*2)) - (6*relFontSize),
            (Math.sin(a)*(w.w/(scale.x*2))>=0) ? 1.05*(Math.sin(a)*(w.w/(scale.x*2)) + (1 * relFontSize)): 1.05*(Math.sin(a)*(w.w/(scale.x*2)) - (1 * relFontSize)))
            ctx.scale(1,-1);
        }
        if (triangleT == true && n != 2 && n!= 1) {
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(Math.cos(a)*(w.w/(scale.x*2)),Math.sin(a)*(w.h/(scale.y*2)));
            ctx.lineTo(Math.cos(a)*(w.w/(scale.x*2)),0);
            ctx.lineTo(0,0);
            ctx.stroke()
            if (Number(Math.cos(a).toFixed(13)) != 0 && Number(Math.sin(a).toFixed(13)) != 0) {
                let sign = (n%1 != 0) ? 1: -1;
                ctx.strokeRect(
                    (Math.abs(Math.cos(a)) == 1 || Number(Math.cos(a).toPrecision(10)) == 0) ? 0: Math.cos(a)*(w.w/(scale.x*2)),
                    0,
                    sign * Math.sign(Math.cos(a)*(w.w/(scale.x*2)))*7.5,
                    sign * Math.sign(Math.sin(a)*(w.h/(scale.y*2)))*7.5
                )
            }
        }
    }
}

function downloadImage() {
    res = 10;
    setup();
    draw();
    document.getElementById("hidden-link").setAttribute("href", `${c.toDataURL("image/png",1000)}`);
    document.getElementById("hidden-link").click();
    res = 3;
    setup();
    draw();
}

function toSuperScript(n) {
    let ss = ["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"];
    let tempn = n;
    let o = new String();
    while (tempn >= 1) {
        o = String(ss[tempn % 10]) + o;
        tempn = Math.floor(tempn/10);
    }
    return o;
}

function record() {
    if (recording == true) {
        document.getElementById("record-button").textContent = "Record";
        recorder.stop();
        recorder.save();
        recorder = new CanvasRecorder(c);
    } else {
        recording = true;
        document.getElementById("record-button").textContent = "Stop Recording";
        recorder.start();
    }
}

function randomColor() {
    return `rgb(${Math.random()*200},${Math.random()*200},${Math.random()*200})`
}

setup();