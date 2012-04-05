document.write('<script type="text/javascript" charset="utf-8" src="../../phonegap-1.3.0.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="../phonegap-1.3.0.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="phonegap-1.3.0.js"></script>');

function backHome() {
	
	if (window.device && device.platform && device.platform.toLowerCase() == 'android') {
            navigator.app.backHistory();
	}
	else {
	    window.history.go(-1);
	}
}
