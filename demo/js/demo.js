$(function(){
  ThreeSixtyRotate('.demo-1',{
    imgPath: 'img/',
    imgEx: 'png',
    zeroPadding: 0,
    imgFirstNum: 1,
    totalFrame: 23,
    startFrame: 1,
    clockwise: false,
    rotateSpeed: 1,
    inertia: true,
    autoRotate: false,
    frameRate: 24,
    overStop: true,
    preload: true,
    showDuration: 300
  });

  ThreeSixtyRotate('.demo-2',{
    imgPath: 'img/',
    imgEx: 'png',
    zeroPadding: 0,
    imgFirstNum: 1,
    totalFrame: 23,
    startFrame: 1,
    clockwise: false,
    rotateSpeed: 1,
    inertia: true,
    autoRotate: true,
    frameRate: 24,
    overStop: true,
    preload: true,
    showDuration: 300
  });

  ThreeSixtyRotate('.demo-3',{
    imgPath: 'img/',
    imgEx: 'png',
    zeroPadding: 0,
    imgFirstNum: 1,
    totalFrame: 23,
    startFrame: 1,
    clockwise: false,
    rotateSpeed: 1,
    inertia: true,
    autoRotate: true,
    frameRate: 24,
    overStop: true,
    preload: true,
    showDuration: 0
  });
});