document.write('<script type="text/javascript" charset="utf-8" src="../../phonegap-1.3.0.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="../phonegap-1.3.0.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="phonegap-1.3.0.js"></script>');

function backHome() {
	if (device.platform.toLowerCase() == 'android') {
            navigator.app.backHistory();
	}
	else {
	    document.location = "../index.html";
	}
}
