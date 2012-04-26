document.write('<script type="text/javascript" charset="utf-8" src="../../cordova-1.7.0.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="../cordova-1.7.0.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="cordova-1.7.0.js"></script>');

function backHome() {
	
	if (window.device && device.platform && device.platform.toLowerCase() == 'android') {
            navigator.app.backHistory();
	}
	else {
	    window.history.go(-1);
	}
}
