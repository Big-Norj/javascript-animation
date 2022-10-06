"use strict"; 

const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.globalCompositeOperation="lighten";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var t=0;
var nodeCount=14;
var armCount=160;
var af=new Array(nodeCount);
var afo=new Array(nodeCount);
var afo2=new Array(nodeCount);
for (let i=0; i<nodeCount; i++) {
  afo[i]=1-2*TP*Math.random();
  afo2[i]=1-2*TP*Math.random();
}

var speed=3200;

var Node=function(pn,idx) {
  this.level=pn?pn.level+1:0;
  this.aos=0.3-0.6*Math.random();
this.r=pn?0.90*pn.r:60;
  this.a0=0;
  this.setPosition=(at)=>{
    if (pn) {
let lp1=Math.pow(this.level+1,0.8);
let lp2=0.7*this.level+1;//this.level+1;
this.a=pn.a+lp2*af[idx]*TP*Math.sin(8*(at+TP*t/speed));//+aos2[idx]);//+this.aos;
      this.x=pn.x+this.r*Math.cos(this.a);
      this.y=pn.y+this.r*Math.sin(this.a);
    } else {
this.a=at;
      this.r=2;
      this.x=this.r*Math.cos(this.a);
      this.y=this.r*Math.sin(this.a);
    }
  }
}

const pf=0.24;	// 0.23 flatt

var Arm=function(idx) {
  let at=TP*idx/armCount;
  this.na=[new Node(0,0)];
  this.na[0].x=80*Math.random();
  for (let i=0; i<nodeCount; i++) {
    let nn=new Node(this.na[i],i+1);
    this.na.push(nn);
  }
  this.setPath=()=>{
    for (let i=0; i<this.na.length; i++) this.na[i].setPosition(at);
    this.path=new Path2D();
    this.path.moveTo(this.na[0].x,this.na[0].y);
    let xn=(this.na[0].x+this.na[1].x)/2
    let yn=(this.na[0].y+this.na[1].y)/2
    for (let i=1; i<this.na.length-1; i++) {
      xn=(this.na[i].x+this.na[i+1].x)/2;
      yn=(this.na[i].y+this.na[i+1].y)/2;
      let cpx=(1-pf)*this.na[i].x+pf*this.na[i-1].x;
      let cpy=(1-pf)*this.na[i].y+pf*this.na[i-1].y;
      let cp2x=(1-pf)*this.na[i].x+pf*this.na[i+1].x;
      let cp2y=(1-pf)*this.na[i].y+pf*this.na[i+1].y;
      this.path.bezierCurveTo(cpx,cpy,cp2x,cp2y,xn,yn);
    }
  }
}

ctx.lineWidth=5;
var hue=getRandomInt(120,240);
var hue2=(hue+getRandomInt(90,180))%360;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
let pa=[new Path2D(), new Path2D()];
  let p1=new Path2D();
  let p2=new Path2D();
  for (let i=0; i<aa.length; i++) {
    pa[i%2].addPath(aa[i].path);
  }
  
let color="hsl("+hue+",96%,52%)";
let color2="hsl("+hue2+",96%,52%)";
  ctx.strokeStyle=color2;
  ctx.stroke(pa[0]);
  ctx.strokeStyle=color;
  ctx.stroke(pa[1])
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var c=0;
var animate=()=>{
  if (stopped) return;
  t++;
  c++;
  let frac=0;
  if (c==speed/2) {
    reset();
    c=0;
  }
  frac=c/(speed/2);
  for (let i=0; i<nodeCount; i++) {
    af[i]=0.017*Math.sin((1-frac)*afo[i]+frac*afo2[i]+t/speed);
  }
  for (let i=0; i<aa.length; i++) aa[i].setPath();
  if (t%20==0) { hue=++hue%360; hue2=++hue2%360; }
  draw();
  requestAnimationFrame(animate);
}

var aa=new Array(armCount);
for (let i=0; i<armCount; i++) {
  aa[i]=new Arm(i);
  aa[i].setPath();
}

var reset=()=>{
  for (let i=0; i<nodeCount; i++) {
    afo[i]=afo2[i];
    afo2[i]=1-2*TP*Math.random();
  }
}

onresize();

start();