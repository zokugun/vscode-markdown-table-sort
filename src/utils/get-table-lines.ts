import { type Range, type TextDocument } from 'vscode';

export function getTableLines(document: TextDocument, tableRange: Range): string[] {
	const tableLines: string[] = [];

	for(let i = tableRange.start.line; i <= tableRange.end.line; i++) {
		const line = document.lineAt(i).text;

		if(tableLines.length >= 2 && /^\|\s*\|/.test(line)) {
			break;
		}

		tableLines.push(line);
	}

	return tableLines;
}
