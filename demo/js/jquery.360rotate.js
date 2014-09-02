/*
* jQuery.ThreeSixtyRotate
* version: 0.0.0
* author: 1026 (Tenjiro Namba)
* License: MIT 
*/

(function(window, document, $){

var eventTypes = ['touch', 'mouse'];
var events = {
  start: {
    touch: 'touchstart',
    mouse: 'mousedown'
  },
  move: {
    touch: 'touchmove',
    mouse: 'mousemove'
  },
  end: {
    touch: 'touchend',
    mouse: 'mouseup'
  }
};

function ThreeSixtyRotate(el, opts){
  return (this instanceof ThreeSixtyRotate)
    ? this.init(el, opts)
    : new ThreeSixtyRotate(el, opts);
};

ThreeSixtyRotate.prototype.init = function(el, opts){
  var self = this;

  self.$el = $(el);

  opts = $.extend({
    imgEx: 'png',
    zeroPadding: 1,
    imgFirstNum: 1,
    totalFrame: 90,
    startFrame: 1,
    clockwise: true,
    rotateSpeed: 1,
    inertia: true,
    autoRotate: false,
    frameRate: 30,
    overStop: true,
    preload: true,
    showDuration: 300
  }, opts);
  
  self.$lists = $('<ul></ul>');

  self.imgPath = opts.imgPath;
  self.imgEx = opts.imgEx;
  self.zeroPadding = opts.zeroPadding + 1;
  self.imgFirstNum = opts.imgFirstNum;
  self.clockwise = (opts.clockwise) ? 1 : -1;
  self.preload = opts.preload;
  self.showDuration = opts.showDuration;
  self.autoRotate = opts.autoRotate;
  self.frameRate = Math.round(1000/opts.frameRate);
  self.overStop = opts.overStop;
  self.rotateSpeed = opts.rotateSpeed*opts.totalFrame/16;
  self.inertia = (opts.inertia) ? 0.88 : 0;

  self.totalFrame = opts.totalFrame;
  self.startFrame = opts.startFrame - 1;

  self.$lists.css('display','none');
  self.eventSetting();
  self.zeroPad();
  self.setImgSrc();

  $(eventTypes).each(function(i, type) {
    self.$el.on(events.start[type],function(e){
      self.eventHandler(e, type);
    });
  });
};

// Set Img Src
// ----------------------------------------------
ThreeSixtyRotate.prototype.zeroPad = function(){
  var self = this;

  var zero = '';

  for(var i = 0; i < self.zeroPadding; i++){
    zero += '0'
  }

  self.zeroNum = zero;
};

ThreeSixtyRotate.prototype.setImgSrc = function(){
  var self = this;

  self.imgs = [];

  for(var i = 0; i < self.totalFrame; i++){
    var imgNum = (self.zeroPadding > 1) ? (self.zeroNum + (i + self.imgFirstNum)).slice(-self.zeroPadding) : i + self.imgFirstNum;
    var imgSrc = self.imgPath + imgNum + '.' + self.imgEx
    self.imgs.push(imgSrc);
  }

  if(self.preload){
    self.preloader();
  } else {
    self.addFrame();
  }
};

// Preload
// ----------------------------------------------
ThreeSixtyRotate.prototype.preloader = function(){
  var self = this;

  var i = 0;

  $(self.imgs).each(function(){
    var src = this;
    var $img = $('<img>').attr('src',src);
    if($img[0].complete){
      i += 1;
      if(i >= self.totalFrame){
        self.addFrame();
      }
    } else {
      $img.on('error',function(){
        self.$el.triggerHandler('imgLoadError');
        return false;
      });

      $img.on('load',function(){
        i += 1;
        if(i >= self.totalFrame){
          self.addFrame();
        }
      });
    }
  });

  self.$el.one('imgLoadError',function(){
    alert('Images failed to load');
  });
};

// Setting Frame
// ----------------------------------------------
ThreeSixtyRotate.prototype.addFrame = function(){
  var self = this;

  self.frms = [];

  for(var i = 0; i < self.totalFrame; i++){
    rotateFrame = new RotateFrame(self.imgs, i, self.startFrame);
    self.$lists.append(rotateFrame.$el);
    self.frms.push(rotateFrame);
  }

  self.frmsLength = self.frms.length;
  self.currentNum = self.startFrame;

  self.showFrames();
};

ThreeSixtyRotate.prototype.showFrames = function(){
  var self = this;

  var preElement = self.$el.find('*');
  self.$el.append(self.$lists);

  self.$el.one('startUpdateRequest', self.startUpdate());

  preElement.fadeOut(self.showDuration,function(){
    preElement.remove();
  });
  self.$lists.fadeIn(self.showDuration,function(){
    self.$el.triggerHandler('startUpdateRequest');
  });

  
};

ThreeSixtyRotate.prototype.startUpdate = function(){
  var self = this;

  setInterval(function(){
    self.update();
  },50);
};

// Change Image
// ----------------------------------------------
ThreeSixtyRotate.prototype.changeImage = function(){
  var self = this;

  self.frms[self.currentNum].$el.css('display','none');

  var preEpsilonX = self.preEpsilonX;
  self.preEpsilonX = Math.abs(self.deltaX) - self.totalFrame/(self.totalFrame/3 - 1);

  if(self.preEpsilonX*preEpsilonX >= 0){
    self.epsilonX =  Math.abs(Math.round(preEpsilonX));
  } else {
    self.endFlg = false;
  }

  self.charge = (!self.endFlg && self.prevDeltaX*self.deltaX < 1) ? 0 : self.charge + self.epsilonX + 1;
  self.distance = (!self.endFlg && self.autoRotate) ? 1 : Math.round(self.charge/self.totalFrame*self.rotateSpeed);

  if(self.distance >= 1){
    if(self.deltaX*self.clockwise < 0){
      self.currentNum = (self.currentNum < self.totalFrame - self.distance) ? self.currentNum + self.distance : 0 + self.totalFrame - self.currentNum;
    } else {
      self.currentNum = (self.currentNum - self.distance > 0) ? self.currentNum - self.distance : self.totalFrame - self.distance;
    }
    self.charge = 0;
  }
  self.frms[self.currentNum].$el.css('display','block');
};

// Update
// ----------------------------------------------
ThreeSixtyRotate.prototype.update = function(){
  var self = this;

  if(self.endFlg == true){
    self.accX = self.accX*self.inertia;
    self.preDeltaX = self.deltaX;
    if(self.accX > 1){
      self.deltaX += Math.round(self.derection*self.accX);
      self.deltaX = self.deltaX - self.preDeltaX;
      if(Math.abs(self.deltaX) < 1) self.deltaX = 0;
      if(Math.abs(self.deltaX) < 1 && self.deltaX > 0) self.deltaX = 1;
      self.changeImage();
    }else{
      if(self.downFlag == false){
        self.deltaX = (self.deltaX > 0) ? 1 : -1;
        self.changeImage();
      } else {
        self.deltaX = 0;
      }
      self.endFlg = false;
    }
  } else if(self.downFlag == false && self.overFlag == false && self.autoRotate == true){
    self.deltaX = -1*self.clockwise;
    self.changeImage();
  } else if(self.downFlag == false) {
    self.deltaX = 0;
  }
};

// Event Handler
// 参考: flipsnap.js ( http://pxgrid.github.com/js-flipsnap/ ) 
//      Copyright 2011 PixelGrid, Inc.
//      Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
// ----------------------------------------------
ThreeSixtyRotate.prototype.eventHandler = function(event, type){
  var self = this;

  switch (event.type){
    // start
    case events.start.touch: self.touchStartHandler(event, 'touch'); break;
    case events.start.mouse: self.touchStartHandler(event, 'mouse'); break;

    // move
    case events.move.touch: self.touchMoveHandler(event, 'touch'); break;
    case events.move.mouse: self.touchMoveHandler(event, 'mouse'); break;

    // end
    case events.end.touch: self.touchEndHandler(event, 'touch'); break;
    case events.end.mouse: self.touchEndHandler(event, 'mouse'); break;
  }
};

ThreeSixtyRotate.prototype.eventSetting = function(){
  var self = this;

  self.axis = null;
  self.endFlg = false;
  self.downFlag = false;
  self.overFlag = false;
  self.derection = 0;

  self.fromX = 0;
  self.fromY = 0;
  self.deltaX = 0;
  self.deltaY = 0;
  self.axis = null;
  self.fix = 0;
  self.charge = 0;
  self.epsilonX = 0;
  self.preEpsilonX = 0;

  self.$el.on('mouseenter',function(e){
    if(self.overStop){
      self.overFlag = true;
    }
  });

  self.$el.on('mouseleave',function(e){
    self.$el.off(events.move['mouse']);
    self.touchEndHandler(event, 'mouse');

    self.overFlag = false;
  });
};

ThreeSixtyRotate.prototype.touchStartHandler = function(event, type){
  var self = this;

  self.$el.on(events.move[type],function(e){
    self.eventHandler(e);
  });
  self.$el.on(events.end[type],function(e){
    self.eventHandler(e);
  });

  if (type === 'mouse'){
    event.preventDefault();
  }


  self.axis = null;
  self.endFlg = false;
  self.downFlag = true;
  self.derection = 0;

  self.fromX = 0;
  self.fromY = 0;
  self.deltaX = 0;
  self.deltaY = 0;
  self.axis = null;
  self.fix = 0;
};

ThreeSixtyRotate.prototype.touchMoveHandler = function(event, type){
  var self = this;

  self.pageX = getPage(event, 'pageX');
  self.pageY = getPage(event, 'pageY');
  self.prevDeltaX = self.deltaX;

  if (self.fromY || self.fromX) {
    self.deltaX = self.pageX - self.fromX;
    self.deltaY = self.pageY - self.fromY;

    if (self.axis === null) {
      self.axis = Math.abs(self.deltaX) > Math.abs(self.deltaY) ? 0 : 1;
    }

    if (self.axis === 0){
      event.preventDefault();

      if(self.prevDeltaX + self.deltaX === 0 || self.prevDeltaX*self.deltaX < 1){
        self.fix = 0;
      }
      self.fix += 1;

      self.changeImage();
    }

  }
  self.fromY = self.pageY;
  self.fromX = self.pageX;
};

ThreeSixtyRotate.prototype.touchEndHandler = function(event, type){
  var self = this;

  self.fromY = 0;
  self.fromX = 0;
  self.startY = 0;
  self.moveY = 0;
  self.charge = 0;

  if (self.axis === 0) {
    if(self.deltaX > 0){
      self.derection = 1;
    } else if(self.deltaX < 0){
      self.derection = -1;
    } else {
      self.derection = 0;
    }

    self.endFlg = true;
    self.accX = Math.abs(self.deltaX) - self.fix;
    if(self.accX < 0){
      self.accX = 0;
    }
    self.fix = 0;
  }

  self.axis = null;
  self.downFlag = false;

  self.$el.off(events.move[type]);
  self.$el.off(events.end[type]);
};

/* 
 Each Frame
---------------------------------------------- */
var RotateFrame = function(imgArr, num, startFrame){
  this.$el = $('<li></li>');

  this.init(imgArr, num, startFrame);
};

RotateFrame.prototype.init = function(imgArr, num, startFrame){
  var self = this;

  self.imgArr = imgArr;
  self.num = num;
  self.startFrame = startFrame;

  self.settingFrame();
};

RotateFrame.prototype.settingFrame = function(){
  var self = this;

  self.$el.css({
    'background-image': 'url(' + self.imgArr[self.num] + ')'
  });

  if(self.num === self.startFrame){
    self.$el.css('display','block');
  } else {
    self.$el.css('display','none');
  }
};



function getPage(event, page) {
  return event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0][page] : event[page];
}


window.ThreeSixtyRotate = ThreeSixtyRotate;

})(window, window.document, jQuery);