
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as mime from 'mime';

import sha512 from './sha';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "img2base64" is now active!');

	let base64Util = vscode.commands.registerCommand('extension.base64', (data: {fsPath: string}) => {

		const stat = fs.statSync(data.fsPath);
		// limit to 100KB
		if (!stat.isDirectory() && stat.size <= 102400) {
			const file = fs.readFileSync(data.fsPath);
			const fileType =  mime.getType(data.fsPath);
			console.log(fileType);
			vscode.env.clipboard.writeText(`data:${fileType};base64,${file.toString('base64')}`).then(() => {
				vscode.window.showInformationMessage('copy base64 succeed!')
			})
		} else {
			!stat.isDirectory() && vscode.window.showErrorMessage(
				'the file size is too large (max 100kB) '
			);
		}
	});

	let sha512Util = vscode.commands.registerCommand('extension.sha512', async (data: {fsPath: string}) => {

		const stat = fs.statSync(data.fsPath);
		console.log(data.fsPath);
		if (!stat.isDirectory()) {
			const result = await sha512(data.fsPath);
			vscode.window.showInformationMessage(`sha512: ${result}`);
		}
	});

	vscode.window.onDidChangeActiveTextEditor(function(editor) {
		console.log(editor)
	})

	context.subscriptions.push(base64Util, sha512Util);
}

// this method is called when your extension is deactivated
export function deactivate() {}
