import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.pasteAsLink', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No editor is active');
			return;
		}

		const clipboardText = await vscode.env.clipboard.readText();
		if (!is_Valid_Url(clipboardText)) {
			vscode.window.showInformationMessage('The clipboard does not contain a valid URL.');
			return;
		}

		const selection = editor.selection;
		const selected_text = editor.document.getText(selection);

		const url = clipboardText;

		const markdownLink = `[${selected_text}](${url})`;
		const htmlLink = `<a href="${url}">${selected_text}</a>`;

		editor.edit((editBuilder) => {
			if (editor.document.languageId === 'markdown') {
				editBuilder.replace(selection.end, markdownLink);
			} else if (editor.document.languageId === 'html') {
				editBuilder.replace(selection.end, htmlLink);
			} else {
				vscode.window.showInformationMessage('Unsupported language for creating link');
			}
		});
	});

	context.subscriptions.push(disposable);
}

function is_Valid_Url(text: string): boolean {
	let urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
	return urlPattern.test(text);
}
