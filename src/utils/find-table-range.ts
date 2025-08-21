import { Position, Range, type TextDocument } from 'vscode';

export function findTableRange(document: TextDocument, line: number): Range | null {
	const isTableLine = (l: number) => {
		if(l < 0 || l >= document.lineCount) {
			return false;
		}

		const text = document.lineAt(l).text;
		return (text.match(/\|/g) ?? []).length >= 2 && /^\s*\|.*\|\s*$/.test(text);
	};

	let start = line;
	while(start > 0 && isTableLine(start - 1)) {
		start--;
	}

	let end = line;
	while(end + 1 < document.lineCount && isTableLine(end + 1)) {
		end++;
	}

	if(!isTableLine(start) || !isTableLine(end)) {
		return null;
	}

	return new Range(
		new Position(start, 0),
		new Position(end, document.lineAt(end).text.length),
	);
}
