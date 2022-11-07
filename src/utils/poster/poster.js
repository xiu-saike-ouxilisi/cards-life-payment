/**
 * 版本：0.2
 * 作者：赵梦昕
 * 依赖：带有二维码的海报生成插件（qrcode）
 * 使用：使用全局变量 _Poster调用toDo()方法
 * 参数：_Poster.toDo({url:需要生成二维码的url地址, bgOption:背景图片的配置（bgImg）, qrOption:二维码的配置（qrcode），
 *                    hasFont：true定义是含有文字,font:文字快捷配置（font）,fontDetail：文字详细配置（fontDetail），})
 * 基础使用：_Poster.toDo({url:"baidu.com",success:function(src){}})
 * QRcode地址:https://github.com/soldair/node-qrcode#qr-code-options
 * 注意：请在服务器环境下使用。
 * **/
import QRCode from 'qrcode'
var _Poster = {
  config: {
    canvas: { id: 'merge_canvas', el: null, cxt: null, width: 464, height: 826, x: 0, y: 0 },
    bgImg: { url: '', width: 464, height: 826, x: 0, y: 0 },
    qrcode: { id: 'qrcode', url: '', width: 120, height: 120, x: 174, y: 536 },
    // top文字与头像之间的距离
    referrer: { url: '', r: 50, x: 0, y: 0, name: '拓客多多', color: '#fff', font: '30px 黑体', top: 15 },
    hasFont: true,
    font: { title: '', detail: '活动详情：', tip: '识别二维码,了解活动详情', color: '#000', type: 2 },
    // 如果需要居中，x需要设定为画布宽度的一半，不需要正常设定即可。默认为居中，type为detail的左对齐
    fontDetail: [
      { type: 'title', text: '盛大开业活动倒计时', font: '60px 黑体', color: '#000', x: 232, y: 131, w: 300, h: 60 },
      { type: 'detail', text: '活动详情：123456', font: '20px 黑体', color: '#000', x: 70, y: 358, w: 320, h: 5 },
      { type: 'tip', text: '识别二维码,了解活动详情', font: '20px 黑体', color: '#000', x: 232, y: 682, w: 243, h: 0 }
    ],
    mergePicUrl: ''
  },
  toDo: function(obj) {
    // url, bgOption, qrOption,font,fontDetail
    // (font,fontDetail传入一个即可 ，若两个都传，以fontDetail为准，若传递fontDetail字段请传递完全)
    // 默认有两种海报模式
    var that = this
    if (obj.type && obj.font) {
      if (obj.type === 1) {
        var config1 = this.initConfig1(obj.font)
        obj.qrOption = config1.qrOption
        obj.fontDetail = config1.fontDetail
      }
      if (obj.type === 2) {
        var config2 = this.initConfig2(obj.font)
        obj.qrOption = config2.qrOption
        obj.fontDetail = config2.fontDetail
      }
    }

    if (obj.font) this.replaceOption(this.config.font, obj.font)

    // 以title为基准判断使用font还是fontDetail，title为空的情况下使用fontDetail的全部字段
    if (obj.fontDetail) {
      this.replaceOption(this.config.fontDetail, obj.fontDetail)
      this.config.font.title = ''
    }

    if (obj.bgOption) this.replaceOption(this.config.bgImg, obj.bgOption)
    if (obj.url) this.config.qrcode.url = obj.url
    if (typeof (obj.hasFont) === 'boolean') this.config.hasFont = obj.hasFont
    if (obj.qrOption) this.replaceOption(this.config.qrcode, obj.qrOption)
    if (obj.canvas) this.replaceOption(this.config.canvas, obj.canvas)

    if (obj.referrer && obj.referrer.url) {
      this.replaceOption(this.config.referrer, obj.referrer)
      this.config.referrer.x = this.config.canvas.width / 2 - this.config.referrer.r
      this.config.referrer.y = this.config.qrcode.y + this.config.qrcode.height + 15
    }

    this.init()
    QRCode.toDataURL(this.config.qrcode.url)
      .then(function(url) {
        that.config.qrcode.url = url
        that.mergePic(function(imgUrl) {
          if (obj.success) obj.success(imgUrl)
        })
      })
      .catch(function(err) {
        // eslint-disable-next-line no-console
        console.error('qrcode catch', err)
      })

    // new QRCode(document.getElementById(this.config.qrcode.id), this.config.qrcode.url);
    // this.config.qrcode.url = document.querySelector('#qrcode canvas').toDataURL('image/jpeg');
    // this.mergePic(function (imgUrl) {
    //     if (obj.success) obj.success(imgUrl);
    // })
  },
  init: function() {
    this.initQR()
    this.initCanvas()
  },
  initElement: function(el, idstr) {
    var body = document.querySelector('body')
    var element = document.createElement(el)
    element.setAttribute('id', idstr)
    element.style.display = 'none'
    body.appendChild(element)
  },
  initCanvas: function() {
    var canvas = this.config.canvas
    this.initElement('canvas', canvas.id)
    canvas.el = document.getElementById(canvas.id)
    canvas.el.width = canvas.width
    canvas.el.height = canvas.height
    canvas.cxt = canvas.el.getContext('2d')
  },
  initQR: function() {
    this.initElement('div', this.config.qrcode.id)
  },
  replaceOption: function(oldOption, newOption) {
    Object.keys(newOption).forEach(function(key) {
      if (newOption[key] || newOption[key] === 0) oldOption[key] = newOption[key]
    })
  },
  // 判断浏览器是否支持canvas标签
  checkReport: function() {
    if (this.config.canvas.el.getContext('2d')) {
      return true
    } else {
      return false
    }
  },
  drawImage: function(option, callback) {
    var that = this
    var img = new Image()
    // 设置图片跨域访问，ios9不支持此属性
    // img.crossOrigin = 'anonymous';
    img.onload = function() {
      that.config.canvas.cxt.drawImage(img, option.x, option.y, option.width, option.height)
      callback()
    }
    img.src = option.url
  },
  // 圆形头像
  drawRoundImage: function(option, callback) {
    var that = this
    this.getBase64(this.config.referrer.url).then(function(base64) {
      var img = new Image()
      // 设置图片跨域访问，ios9不支持此属性
      // img.crossOrigin = 'anonymous';
      var cxt = that.config.canvas.cxt
      img.onload = function() {
        var cx = option.x + option.r
        var cy = option.y + option.r
        cxt.arc(cx, cy, option.r, 0, 2 * Math.PI)
        cxt.clip()
        cxt.drawImage(img, option.x, option.y, option.r * 2, option.r * 2)
        cxt.restore()
        callback()
      }
      img.src = base64
    })
  },
  mergePic: function(callback) {
    if (!this.checkReport()) {
      alert('您的浏览器不支持canvas，请换个浏览器试试')
      return false
    }
    var that = this
    var config = this.config

    this.getBase64(config.bgImg.url).then(function(bgBase64) {
      config.bgImg.url = bgBase64
      that.drawImage(config.bgImg, function() {
        that.drawImage(config.qrcode, function() {
          if (config.hasFont) that.writeFont()
          that.wirteReferrer()
          that.drawRoundImage(config.referrer, function() {
            callback(config.canvas.el.toDataURL('image/png'))
          })
        })
      })
    })
  },
  // 添加文字
  writeFont: function() {
    var that = this
    var config = this.config
    var ctx = this.config.canvas.cxt
    this.config.fontDetail.forEach(function(item) {
      ctx.font = item.font
      if (item.type !== 'detail') {
        ctx.textAlign = 'center'
      } else {
        ctx.textAlign = 'start'
      }
      if (config.font.title) {
        ctx.fillStyle = config.font.color
        that.fillText(config.font[item.type], item.x, item.y, item.w, item.h)
      } else {
        ctx.fillStyle = item.color
        that.fillText(item.text, item.x, item.y, item.w, item.h)
      }
    })
  },
  // 推荐人
  wirteReferrer: function() {
    var canvas = this.config.canvas
    var ctx = this.config.canvas.cxt
    var referrer = this.config.referrer
    var name = ''
    if (referrer.name.length > 20) {
      name = referrer.name.substr(0, 5) + '...'
    } else {
      name = referrer.name
    }
    ctx.font = referrer.font
    ctx.textAlign = 'center'
    ctx.fillStyle = referrer.fillStyle || '#000'
    ctx.fillText('推荐人：' + name, canvas.width / 2, referrer.y + referrer.r * 2 + referrer.top)
  },
  // 自动换行换行
  fillText: function(t, x, y, w, h) {
    var chr = t.split('')
    var temp = ''
    var row = []

    var cxt = this.config.canvas.cxt
    cxt.textBaseline = 'middle'

    for (var a = 0; a < chr.length; a++) {
      if (cxt.measureText(temp).width >= w) {
        row.push(temp)
        temp = ''
      }
      temp += chr[a]
    }

    row.push(temp)

    for (var b = 0; b < row.length; b++) {
      cxt.fillText(row[b], x, y + (b + 1) * 20 + b * h)
    }
  },
  initConfig1: function(poster) {
    return {
      qrOption: {
        x: (this.config.canvas.width - this.config.qrcode.width) / 2,
        y: 416
      },
      fontDetail: [
        { type: 'title', text: poster.title, font: 'bold 60px 黑体', color: poster.color, x: 232, y: 160, w: 280, h: 60 },
        { type: 'detail', text: poster.detail, font: '18px 微软雅黑', color: poster.color, x: 91, y: 290, w: 280, h: 5 },
        { type: 'tip', text: '', font: 'bolder 20px 黑体', color: poster.color, x: 232, y: 600, w: 243, h: 0 }
      ]
    }
  },
  initConfig2: function(poster) {
    return {
      qrOption: {
        x: (this.config.canvas.width - this.config.qrcode.width) / 2,
        y: 526
      },
      fontDetail: [
        { type: 'title', text: poster.title, font: 'bold 60px 黑体', color: poster.color, x: 232, y: 150, w: 300, h: 60 },
        { type: 'detail', text: poster.detail, font: '18px 微软雅黑', color: poster.color, x: 70, y: 338, w: 320, h: 5 },
        { type: 'tip', text: '', font: 'bolder 20px 黑体', color: poster.color, x: 232, y: 697, w: 243, h: 0 }
      ]
    }
  },
  // 将图片地址转换为base64格式，处理图片跨域问题
  getBase64: function(img) {
    // width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    function getBase64Image(img, width, height) {
      var canvas = document.createElement('canvas')
      canvas.width = width || img.width
      canvas.height = height || img.height

      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      var dataURL = canvas.toDataURL()
      return dataURL
    }

    var image = new Image()
    // 微信头像跨域，必须加上null的crossOrigin，若有值则ios9不兼容该属性
    image.crossOrigin = ''
    return new Promise(function(resolve, reject) {
      // 将base64传给done上传处理
      image.onload = function() {
        resolve(getBase64Image(image))
      }
      // 处理微信CDN缓存
      image.src = img
      // image.src = img + '?' + new Date().getTime();
    })
  }
}
export default _Poster

