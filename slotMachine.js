var idNumber = 0;
var maxSpeed = 50;  // 最大速度
function SlotMachine(config) {
  this.topPX = 0;
  this.speed = 0;
  const ctx = this.init(config);
  ctx.globalCompositeOperation = 'destination-over';
  ctx.font = config.fontSize + "px acc";
  this.ctx = ctx;
  this.stopTime = config.stopTime;
  this.imgList = config.imgList;
  this.width = config.width;
  this.height = config.height;
  this.fontSize = config.fontSize;
  this.fontWidth = config.fontSize * 0.362;
  this.fontHeight = config.fontSize * 0.667 + 15;
  this.textLeft = (this.width - this.fontWidth) / 2;
  this.isAcceleration = false;  // 加速中
  this.isDeceleration = false;  // 减速中
  // topPX 是 this.fontHeight 的整数倍X时，数字显示在正中间，数字 = X % 10
  // this.topPX = this.fontHeight * 115;

  this.render([{img: config.defaultImage, y:0}], this.fontHeight / 2);
}

SlotMachine.prototype.init = function ({
  dom, width, height
}) {
  const canvasDom = document.createElement('canvas');
  canvasDom.id = "scroll" + idNumber;
  idNumber++;
  canvasDom.width = width;
  canvasDom.height = height;
  // canvasDom.style.width = "100%";
  // canvasDom.style.height = "100%";
  dom.appendChild(canvasDom);
  return canvasDom.getContext('2d');
}


SlotMachine.prototype.start = function (time) {
  this.getSpeed = init(Date.now(), time * 1000, 0, maxSpeed);
  this.speed = 0;
  this.isAcceleration = true;
  window.requestAnimationFrame(this.draw.bind(this));
}
SlotMachine.prototype.end = function (target) {
  this.target = target;
  this.isDeceleration = true;
  const currentNumber = parseInt(this.topPX / this.fontHeight);
  const currentShowNumber = currentNumber % 10;
  const diff = currentNumber - currentShowNumber;
  if (target <= currentShowNumber) {
    target = target + 10;
  }
  if (target - currentShowNumber < 5) {
    target = target + 10;
  }
  const targetNumber = diff + target + 10;
  const targetPX = parseInt(this.fontHeight * targetNumber);
  this.targetPX = targetPX;
  this.getSpeed = init(Date.now(), this.stopTime, this.topPX, targetPX);
}
SlotMachine.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
  const numbers = this.getNumber();
  const drawList = [];
  numbers.forEach((i, index) => {
    const y0 = (i + 1.5) * this.fontHeight - this.topPX;
    drawList.push({
      img: this.imgList[i % 10],
      y: y0
    })
    
    // const gradient = this.getLinear(y0);
    // this.ctx.fillStyle = gradient;
    // this.ctx.fillText(i % 10, this.textLeft, y0);
  })
  this.render(drawList);
  if (this.isDeceleration) {
    this.topPX = this.getSpeed(Date.now());
    this.myReq = window.requestAnimationFrame(this.draw.bind(this));
    if (this.topPX >= this.targetPX) {
      this.isDeceleration = 0;
      window.cancelAnimationFrame(this.myReq);
    }
    return;
  } else {
    if (this.isAcceleration) {
      if (this.speed >= maxSpeed) {
        this.isAcceleration = false;
      } else {
        this.speed = this.getSpeed(Date.now());
      }
    }
    this.topPX = this.topPX + this.speed;
    this.myReq = window.requestAnimationFrame(this.draw.bind(this));
  }
}
SlotMachine.prototype.render = function (drawList, fontHeight) {
  var liH = this.fontHeight;
  drawList.forEach(i=> {
    console.log(i);
    this.ctx.drawImage(i.img, this.textLeft, i.y,this.fontWidth, fontHeight || this.fontHeight);
  })
}
SlotMachine.prototype.drawImage=function(img,dx,dy,w,h){
  if(typeof w!=='undefined' && typeof h !=='undefined' ){
    this.ctx.drawImage(img,0,0,w,h,dx,dy,w,h);
  }else{
    this.ctx.drawImage(img,0,0,img.width,img.height,dx,dy,this.width,this.height);
  }
}

SlotMachine.prototype.getNumber = getNumber;
SlotMachine.prototype.getLinear = getLinear

export default SlotMachine;

function getNumber() {
  const num = parseInt(this.topPX / this.fontHeight);
  if (num === 0) {
    return [0, 1, 2];
  }
  if (num === 1) {
    return [0, 1, 2, 3];
  }
  return [num - 2, num - 1, num, num + 1, num + 2]
}
function getLinear(start) {
  const gradient = this.ctx.createLinearGradient(0, start, 0, start - this.height / 2);
  gradient.addColorStop(0, "#882E75");
  gradient.addColorStop(1, "#EB629A");
  return gradient;
}