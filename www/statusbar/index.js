
function log(msg) {
    console.log(msg);
    var el = document.getElementById("info");
    el.textContent += msg + '\n';
}

function doShow() {
    StatusBar.show();
    log('StatusBar.isVisible=' + StatusBar.isVisible);
}

function doHide() {
    StatusBar.hide();
    log('StatusBar.isVisible=' + StatusBar.isVisible);
}

function doColor1() {
    log('set color=red');
    StatusBar.backgroundColorByName('red');
}

function doColor2() {
    log('set style=translucent black');
    StatusBar.styleBlackTranslucent();
}

function doColor3() {
    log('set style=default');
    StatusBar.styleDefault();
}

var showOverlay = true;
function doOverlay() {
    showOverlay = !showOverlay;
    StatusBar.overlaysWebView(showOverlay);
    log('Set overlay=' + showOverlay);
}

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
        log("Device="+device.platform+" "+device.version);
        log('StatusBar.isVisible=' + StatusBar.isVisible);
    }, false);
}

window.onload = function() {
  addListenerToClass('action-show', doShow);
  addListenerToClass('action-hide', doHide);
  addListenerToClass('action-color1', doColor1);
  addListenerToClass('action-color2', doColor2);
  addListenerToClass('action-color3', doColor3);
  addListenerToClass('action-overlays', doOverlay);
  addListenerToClass('backBtn', backHome);
  init();
  window.addEventListener('statusTap', function() {
      log('tap!');
  }, false);
}
