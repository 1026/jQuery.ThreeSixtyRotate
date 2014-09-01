#jQuery.ThreeSixtyRotate

画像連番で商品写真とかクルクルまわすやつ

##Demo
[http://1026.github.io/jQuery.ThreeSixtyRotate/demo/](http://1026.github.io/jQuery.ThreeSixtyRotate/demo/)

##Usage

HTML

    <div class="test"><p>Now loading...</p></div>
    
CSS

    .test {
        position: relative;
        width: ---px;
        height: ---px;
    }
    .test li {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-size: 100%;
    }


JS

    ThreeSixtyRotate('.test',{
      imgPath: 'img/rotate/', //画像パス（＊必須）（画像ファイル名が数字だけでなければ数字の直前まで）
      imgEx: 'png',           //画像の拡張子
      zeroPadding: 1,         //Zero Padding (ex:1→0、01→1、001→2)
      imgFirstNum: 1,         //一番初めの画像ファイル名の1の位の数字（大抵 0 or 1）
      totalFrame: 90,         //画像枚数
      startFrame: 1,          //1フレーム目を何枚目の画像にするか
      clockwise: true,        //画像の書き出しが、時計回りならtrue、反時計回りならfalse
      rotateSpeed: 1,         //ドラッグで回転させるときのスピード
      inertia: true           //慣性 (false で慣性なし)
      autoRotate: false,      //自動で回転させるか
      frameRate: 30,          //自動回転のフレームレート
      overStop: true,         //自動で回転させた時、マウスオーバーで止めるか否か
      preload: true,          //画像をプリロードするか（基本trueでいいかと）
      showDuration: 300       //フェード表示のduration
    });

##Browsers
IE8+

##Note
プリロードこけて止まったらゴメンナサイ。  
CSSちゃんとすればレスポンシブでも動くはず。  
Android 動かないかも。

##License
MIT
