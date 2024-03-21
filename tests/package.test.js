import jsonfile from 'jsonfile';

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

let packageJSONData;

beforeAll(() => {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const filePath = path.join(__dirname, '..', 'package.json');
	const fileContents = fs.readFileSync(filePath, 'utf8');
	packageJSONData = JSON.parse(fileContents);
});

describe('package.json file', () => {
	beforeAll(() => {
		const file = './package.json';
		packageJSONData = jsonfile.readFileSync(file);
	});

	const validPattern = /^(?:\^|~)?\d+\.\d+\.\d+$/;
	const regex = new RegExp(validPattern);

	test('Should allow flexible versions for dependencies', () => {
		const allDependenciesAreValid = Object.values(packageJSONData.dependencies).every(version => regex.test(version));
		expect(allDependenciesAreValid).toBe(true);
	});

	test('Should allow flexible versions for devDependencies', () => {
		const allDevDependenciesAreValid = Object.values(packageJSONData.devDependencies).every(version => regex.test(version));
		expect(allDevDependenciesAreValid).toBe(true);
	});
});
