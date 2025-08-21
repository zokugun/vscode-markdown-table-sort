import { type Position } from 'vscode';
import { parseRow } from './parse-row.js';

export function getNumberColumn(tableLines: string[], currentRow: number, position: Position): number {
	const headerCells = parseRow(tableLines[0]);
	const numberColIndices = getNumberColIndices(headerCells);

	// Determine which number column we're in
	const thisLineText = tableLines[currentRow];
	let numberCol = getNumberColumnAtPosition(position, headerCells, thisLineText);

	if(numberCol === -1 || !numberColIndices.includes(numberCol)) {
		numberCol = numberColIndices[0];
	}

	return numberCol;
}

function getNumberColIndices(headerCells: string[]): number[] { // {{{
	// All columns except the first one are considered number columns
	if(headerCells.length > 1) {
		return Array.from({ length: headerCells.length - 1 }, (_, i) => i + 1);
	}
	else {
		return [];
	}
} // }}}

function getNumberColumnAtPosition(position: Position, headerCells: string[], lineText: string): number { // {{{
	let pipeCount = -1;
	for(let i = 0; i < position.character && i < lineText.length; i++) {
		if(lineText[i] === '|') {
			pipeCount++;
		}
	}

	if(pipeCount <= 0) {
		return -1;
	}

	if(pipeCount >= headerCells.length) {
		return -1;
	}

	return pipeCount;
} // }}}
