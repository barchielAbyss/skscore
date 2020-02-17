var DEFAULT_ANCHORS = ["#01061e", "#01061e"];

$(document).ready(function() {
  var locationQuery = location.search;
  var downloadUrl =
    "https://w.skscore.com/download/plist" +
    (~locationQuery.indexOf("ch=") ? locationQuery : "?ch=2");

  $("#version-download").attr({
    href: downloadUrl,
  });

  var $main = $("#full-page");
  var $guideimg = $("#guideimg");
  var $notsupport = $("#notsupport");

  var getVersion = function() {
    var timestamp = Math.round(new Date() / 1000);
    var timestampstr = "ts=" + timestamp + "&0";
    var timestampmd5 = md5.md5(timestampstr, 32);
    
      $.ajax({
        url: "https://w.skscore.com/system/version" + "?ts=" + timestamp + '&platform=2',
        type: "GET",
        dataType: 'jsonp',
        jsonp: '_callback',
        xhrFields: {
          withCredentials: true    // 此字段标识要跨域传数据
        },
        crossDomain: true,
        beforeSend: function(request) {
          request.setRequestHeader("tkey", "0");
          request.setRequestHeader("sign", timestampmd5);
          request.setRequestHeader("version", "0.0.1");
          request.setRequestHeader("lang", "j");
          request.setRequestHeader("platform", "2");
        },
        success: function(res) {
          var code = res.code
          if (code !== 0) {
            return
          }
          var data = res.data.info
          if (data.version) {
            $('#version-number').text(
              ~data.version.indexOf('版本') ? data.version : '版本'+ data.version
            )
          }
          if (data.size) {
            $('#version-size').text(
              ~data.size.indexOf('大小') ? data.size : '大小'+ data.size
            )
          }
          if (data.update_time) {
            $('#version-time').text(
              ~data.update_time.indexOf('更新时间') ? data.update_time : '更新时间 ' + data.update_time
            )
          }
        },
      });
    };
    

  var browserName = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    var old_ie = ~ua.indexOf("MSIE ");
    var new_ie = ~ua.indexOf("Trident/");

    if (
      ua.match(/MicroMessenger/i) == "micromessenger" ||
      ua.match(/QQ/i) == "qq" ||
      ua.match(/WeiBo/i) == "weibo"
    ) {
      return "weixin";
    }
    if (~ua.indexOf("opera")) {
      return "opera";
    }
    if (~ua.indexOf("firefox")) {
      return "ff";
    }
    if (~ua.indexOf("chrome")) {
      return "chrome";
    }
    if (~ua.indexOf("safari")) {
      return "safari";
    }
    if (
      ~ua.indexOf("compatible") &&
      !~ua.indexOf("opera") &&
      (old_ie || new_ie)
    ) {
      return "ie";
    }
  };
  //  判断浏览器环境
  var browser = browserName();
  if (browser === "weixin") {
    $main.hide();
    $guideimg.show();
  } else if (browser !== "chrome" && browser !== "safari") {
    $main.hide();
    $notsupport.show();
  } else {
    getVersion();
  }

  var Toast = function(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement("div");
    m.innerHTML = msg;
    m.style.cssText =
      "max-width:60%;min-width: 250px;padding:0 14px;height: 80px;color: rgb(255, 255, 255);line-height: 80px;text-align: center;border-radius: 4px;position: fixed;top: 25%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 26px;";
    document.body.appendChild(m);
    setTimeout(function() {
      var d = 2.5;
      m.style.webkitTransition =
        "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
      m.style.opacity = "0";
      setTimeout(function() {
        document.body.removeChild(m);
      }, d * 1000);
    }, duration);
  };

  var copyurlstr = function() {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute(
      "value",
      "https://www.lyscores.com:9107/web/download.html"
    );
    input.select();
    if (document.execCommand("copy")) {
      document.execCommand("copy");
    }
    document.body.removeChild(input);
    Toast("复制成功", 2.5);
  };

  $(document).ready(function() {
    $(".section").each(function(index) {
      $(this).css({
        backgroundColor: DEFAULT_ANCHORS[index],
      });
    });
    new Swiper("#full-page", {
      direction: "vertical",
      wrapperClass: "download-wrapper",
      slideClass: "section",
    });

    new Swiper("#banner", {
      wrapperClass: "banner-list",
      slideClass: "banner-item",
      pagination: ".banner-pagination",
      nextButton: ".banner-button-next",
      prevButton: ".banner-button-prev",
    });

    new Swiper("#help-banner", {
      wrapperClass: "banner-list",
      slideClass: "banner-item",
      pagination: ".banner-pagination",
      nextButton: ".banner-button-next",
      prevButton: ".banner-button-prev",
    });

    $("#notsupport")
      .find(".copybtn")
      .on("click", function() {
        copyurlstr();
      });
  });
});
