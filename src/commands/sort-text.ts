import vscode from 'vscode';
import { findTableRange } from '../utils/find-table-range.js';
import { getTableLines } from '../utils/get-table-lines.js';
import { parseRow } from '../utils/parse-row.js';
import { replaceTable } from '../utils/replace-table.js';
import { type SortOrder } from '../utils/types.js';

export async function sortText(order: SortOrder) {
	const editor = vscode.window.activeTextEditor;
	if(!editor) {
		return;
	}

	const document = editor.document;
	const position = editor.selection.active;
	const line = position.line;

	const tableRange = findTableRange(document, line);
	if(!tableRange) {
		return;
	}

	const tableLines = getTableLines(document, tableRange);

	const firstDataRow = 2;
	const lastDataRow = tableLines.length - 1;
	const currentRow = line - tableRange.start.line;

	if(currentRow < firstDataRow || currentRow > lastDataRow) {
		return;
	}

	const scores: Array<{ index: number; label: string }> = [];

	for(let i = firstDataRow; i <= lastDataRow; i++) {
		const cells = parseRow(tableLines[i]);

		scores.push({ index: i, label: cells[0].trim() });
	}

	if(order === 'asc') {
		scores.sort((a, b) => a.label.localeCompare(b.label));
	}
	else {
		scores.sort((a, b) => b.label.localeCompare(a.label));
	}

	const newTableLines = tableLines.slice(0, firstDataRow);

	for(const { index } of scores) {
		newTableLines.push(tableLines[index]);
	}

	await replaceTable(editor, tableRange, newTableLines);
}
