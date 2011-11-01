document.write('<script type="text/javascript" charset="utf-8" src="../phonegap-1.2.0.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="phonegap-1.2.0.js"></script>');

function backHome() {
	if (device.platform.toLowerCase() == 'android') {
		navigator.app.exitApp();
	}
	else {
		document.location = "../index.html";
	}
}