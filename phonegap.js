document.write('<script type="text/javascript" charset="utf-8" src="../phonegap-0.9.6.1.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="phonegap-0.9.6.1.js"></script>');

function backHome() {
	if (device.platform.toLowerCase() == 'android') {
		navigator.app.exitApp();
	}
	else {
		document.location = "../index.html";
	}
}