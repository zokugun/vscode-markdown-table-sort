import { Position, Range, type TextEditor } from 'vscode';

export async function replaceTable(editor: TextEditor, tableRange: Range, tableLines: string[]) {
	const lastTableRangeLine = tableRange.start.line + tableLines.length - 1;

	return editor.edit((editBuilder) => {
		editBuilder.replace(
			new Range(
				new Position(tableRange.start.line, 0),
				new Position(lastTableRangeLine, editor.document.lineAt(lastTableRangeLine).text.length),
			),
			tableLines.join('\n'),
		);
	});
}
