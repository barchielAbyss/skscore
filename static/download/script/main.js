var DEFAULT_ANCHORS = ['#01061e','#f7f8fa','#020721','#ffffff','#020721','#01051e']

var getItemIsShow = function () {
  var clientHeight = window.innerHeight
  var visibleTop = $(document).scrollTop()
  var visibleBottom = visibleTop + clientHeight;
  
  $('.section').each(function(index) {
    $(this).css({
      backgroundColor: DEFAULT_ANCHORS[index]
    })

    var offsetTop = $(this).offset().top
    var offsetHeight = $(this).outerHeight()
    var centerY = offsetTop + (offsetHeight / 2)

    if (centerY < visibleBottom) {
      $(this).addClass('run-animation')
    }
  })
}

$(document).ready(function() {
  getItemIsShow()

  $(document).scroll(function(e){
    getItemIsShow()
  })
  
  var locationQuery = location.search || '?ch=2'
  // document.getElementById('qr-code-img').src = 'https://w.skscore.com/qrcode/dl' + locationQuery
  document.getElementById('ios-download').href = 'https://w.skscore.com/download/plist' + locationQuery
  document.getElementById('apk-download').href = 'https://w.skscore.com/download/apk' + locationQuery

  $('.header').on('mouseover', '.qr-code-buttons-item', function() {
    $('.qr-code-buttons-item').removeClass('btnActive')
    $(this).addClass('btnActive')
  })
});
