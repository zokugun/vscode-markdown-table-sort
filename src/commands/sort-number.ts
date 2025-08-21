import vscode from 'vscode';
import { findTableRange } from '../utils/find-table-range.js';
import { getNumberColumn } from '../utils/get-number-column.js';
import { getTableLines } from '../utils/get-table-lines.js';
import { parseRow } from '../utils/parse-row.js';
import { replaceTable } from '../utils/replace-table.js';
import { type NumberCell, type SortOrder } from '../utils/types.js';

export async function sortNumber(order: SortOrder) {
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

	const numberCol = getNumberColumn(tableLines, currentRow, position);
	if(!numberCol || numberCol < 1) {
		await vscode.window.showWarningMessage('No number column found under cursor.');

		return;
	}

	// Build list of current numbers (excluding the selected row)
	const numbers: NumberCell[] = [];
	for(let i = firstDataRow; i <= lastDataRow; i++) {
		const cells = parseRow(tableLines[i]);
		const rawValue = cells[numberCol].trim();
		const value = Number.parseFloat(rawValue);

		if(Number.isNaN(value)) {
			numbers.push({ index: i, raw: rawValue, label: cells[0].trim(), cells });
		}
		else {
			numbers.push({ index: i, raw: rawValue, value, label: cells[0].trim(), cells });
		}
	}

	if(order === 'asc') {
		numbers.sort((a, b) => {
			if(typeof a.value === 'number') {
				if(typeof b.value === 'number') {
					return a.value - b.value;
				}
				else {
					return -1;
				}
			}
			else if(typeof b.value === 'number') {
				return 1;
			}
			else if(a.raw === '-') {
				if(b.raw === '-') {
					return a.label.localeCompare(b.label);
				}
				else {
					return -1;
				}
			}
			else {
				if(b.raw === '-') {
					return 1;
				}
				else {
					return a.label.localeCompare(b.label);
				}
			}
		});
	}
	else {
		numbers.sort((a, b) => {
			if(typeof a.value === 'number') {
				if(typeof b.value === 'number') {
					return b.value - a.value;
				}
				else {
					return -1;
				}
			}
			else if(typeof b.value === 'number') {
				return 1;
			}
			else if(a.raw === '-') {
				if(b.raw === '-') {
					return a.label.localeCompare(b.label);
				}
				else {
					return -1;
				}
			}
			else {
				return a.label.localeCompare(b.label);
			}
		});
	}

	const newTableLines = tableLines.slice(0, firstDataRow);
	const inserted = {};

	for(const { index } of numbers) {
		newTableLines.push(tableLines[index]);

		inserted[index] = true;
	}

	for(let i = firstDataRow; i <= lastDataRow; i++) {
		if(!inserted[i]) {
			newTableLines.push(tableLines[i]);
		}
	}

	await replaceTable(editor, tableRange, newTableLines);
}
