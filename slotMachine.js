var idNumber = 0;
var acceleration = 2;
var maxSpeed = 40;
function SlotMachine(config) {
  this.target = -1;
  this.topPX = 0;
  this.speed = 10;
  const ctx = this.init(config);
  ctx.globalCompositeOperation = 'destination-over';
  ctx.font = config.fontSize + "px acc";
  this.ctx = ctx;
  this.width = config.width;
  this.height = config.height;
  this.fontSize = config.fontSize;
  this.fontWidth = config.fontSize * 0.362;
  this.fontHeight = config.fontSize * 0.667 + 15;
  this.textLeft = (this.width - this.fontWidth) / 2;
  this.scrollTime = 0;
  this.startSlow = false;
}

SlotMachine.prototype.init = function ({
  dom, width, height
}) {
  const canvasDom = document.createElement('canvas');
  canvasDom.id = "scroll" + idNumber;
  idNumber++;
  canvasDom.width = width;
  canvasDom.height = height;
  canvasDom.style.width = "100%";
  canvasDom.style.height = "100%";
  dom.appendChild(canvasDom);
  return canvasDom.getContext('2d');
}


SlotMachine.prototype.start = function () {
  this.target = -1;
  this.scrollTime = 0;
  this.speed = 1;
  window.requestAnimationFrame(this.draw.bind(this));
}
SlotMachine.prototype.end = function (target) {
  this.target = target;
  this.startSlowNumber = this.getStartSlowNumber();
  console.log("中奖号码为：%d", target, this.startSlowNumber);
}
SlotMachine.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
  const numbers = this.getNumber();
  numbers.forEach((i, index) => {
    const y0 = (i + 1.6) * this.fontHeight - this.topPX;
    const gradient = this.getLinear(y0);
    this.ctx.fillStyle = gradient;
    this.ctx.fillText(i % 10, this.textLeft, y0);
  })
  this.ctx.save();
  if (this.target > -1) {
    if (numbers[6] % 10 === this.target) {
      console.log(this.scrollTime);
      if (this.scrollTime === 0) {
        window.cancelAnimationFrame(this.myReq);
        return;
      } else {
        this.scrollTime = 0;
      }
    }
    if (this.scrollTime === 0) {
      if (numbers[2] % 10 === this.startSlowNumber ) {
        this.startSlow = true;
      }
    }
    if (this.startSlow) {
      console.log(this.speed);
      this.speed = this.speed - 3;
    }
  } else if (this.scrollTime < maxSpeed * acceleration) {
    if (this.scrollTime % acceleration === 0) {
      this.speed = this.speed + 1;
    }
    this.scrollTime++;
  }
  this.topPX = this.topPX + this.speed;
  this.myReq = window.requestAnimationFrame(this.draw.bind(this));
}

SlotMachine.prototype.getNumber = getNumber;
SlotMachine.prototype.getStartSlowNumber = getStartSlowNumber
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


function getStartSlowNumber() {
  if (this.target < 2) {
    return this.target + 10 - 2;
  }
  return this.target - 2;
}