import fs from 'fs';
import JavaScriptObfuscator from 'javascript-obfuscator';

const MINER_CODE_PATH = './src/lib/services/miner/';

const result = JavaScriptObfuscator.obfuscate(
	fs.readFileSync(MINER_CODE_PATH + '/main.js').toString(),
	{
		compact: true,
		controlFlowFlattening: true,
		controlFlowFlatteningThreshold: 1,
		deadCodeInjection: true,
		deadCodeInjectionThreshold: 1,
		identifierNamesGenerator: 'hexadecimal',
		numbersToExpressions: true,
		renameGlobals: true,
		selfDefending: true,
		simplify: true,
		splitStrings: true,
		splitStringsChunkLength: 5,
		stringArray: true,
		stringArrayCallsTransform: true,
		stringArrayEncoding: ['rc4'],
		stringArrayIndexShift: true,
		stringArrayRotate: true,
		stringArrayShuffle: true,
		stringArrayWrappersCount: 5,
		stringArrayWrappersChainedCalls: true,
		stringArrayWrappersParametersMaxCount: 5,
		stringArrayWrappersType: 'function',
		stringArrayThreshold: 1,
		transformObjectKeys: true,
		unicodeEscapeSequence: true,
		renameProperties: false
	}
);

const path = MINER_CODE_PATH + '/4.js';
try {
	fs.rmSync(path);
} catch (err) {}
fs.writeFileSync(path, result.getObfuscatedCode());
