var idNumber = 0;
var maxSpeed = 50;  // 最大速度
function SlotMachine(config) {
  this.topPX = 0;
  this.speed = 0;
  const ctx = this.init(config);
  ctx.globalCompositeOperation = 'destination-over';
  this.ctx = ctx;
  this.config = config;
  this.stopTime = config.stopTime;
  this.imgList = config.imgList;
  this.width = config.width;
  this.height = config.height;
  this.fontWidth = config.width * 0.4,
  this.fontHeight = config.height * 0.6,
  this.numberHeight = this.fontHeight * 0.8,
  this.textLeft = (this.width - this.fontWidth) / 2;
  this.isAcceleration = false;  // 加速中
  this.isDeceleration = false;  // 减速中
  this.renderDefaultImage();
}

SlotMachine.prototype.init = function ({
  dom, width, height
}) {
  const canvasDom = document.createElement('canvas');
  canvasDom.id = "scroll" + idNumber;
  idNumber++;
  canvasDom.width = width;
  canvasDom.height = height;
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
  this.targetPX = this.getTargetPX();
  this.getPX = init(Date.now(), this.stopTime, this.topPX, this.targetPX);
}
SlotMachine.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
  const numbers = this.getNumber();
  const drawList = [];
  numbers.forEach((i, index) => {
    const y0 = (i + 1.4) * this.fontHeight - this.topPX;
    drawList.push({
      img: this.imgList[i % 10],
      y: y0
    })
  })
  this.render(drawList, numbers[0] === 0);
  if (this.isDeceleration) {
    this.topPX = this.getPX(Date.now());
    this.myReq = window.requestAnimationFrame(this.draw.bind(this));
    if (this.topPX >= this.targetPX) {
      this.isDeceleration = 0;
      window.cancelAnimationFrame(this.myReq);
    }
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
SlotMachine.prototype.render = function (drawList, isShowDefault) {
  if (isShowDefault) {
    this.renderDefaultImage(0.5 * this.fontHeight - this.topPX);
  }
  drawList.forEach(i=> {
    this.ctx.drawImage(
      i.img, i.x || this.textLeft, i.y,
      this.fontWidth, this.numberHeight
    );
  })
}
SlotMachine.prototype.renderDefaultImage = function (y) {
  this.ctx.drawImage(
      this.config.defaultImage,
      (this.config.width - this.config.defaultImageWidth) / 2,
      y ? y + 15 : (this.config.height - this.config.defaultImageHeight) / 2,
      this.config.defaultImageWidth, this.config.defaultImageHeight
    );
}

SlotMachine.prototype.getNumber = getNumber;
SlotMachine.prototype.getTargetPX = getTargetPX;

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

function getTargetPX () {
  const currentNumber = parseInt(this.topPX / this.fontHeight);
  const currentShowNumber = currentNumber % 10;
  const diff = currentNumber - currentShowNumber;
  let target = this.target;
  if (target <= currentShowNumber) {
    target = target + 10;
  }
  if (target - currentShowNumber < 5) {
    target = target + 10;
  }
  // 目标数字和当前显示数字 差值范围[15, 24]
  const targetNumber = diff + target + 10;
  return parseInt(this.fontHeight * targetNumber);
}