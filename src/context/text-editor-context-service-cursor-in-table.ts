import { type ExtensionContext, type TextEditor, type TextEditorSelectionChangeEvent } from 'vscode';
import { isInTable } from '../utils/is-in-table.js';
import { ContextService } from './context-service.js';

export class TextEditorContextServiceCursorInTable extends ContextService {
	private readonly defaultVal: boolean;

	constructor(contextName: string, defaultValue: boolean) {
		super(contextName);
		this.defaultVal = defaultValue;
	}

	public onActivate(context: ExtensionContext) {
		super.onActivate(context);

		// set initial state of context
		this.setState(this.defaultVal);
	}

	public onDidChangeActiveTextEditor(editor: TextEditor | undefined): void {
		super.onDidChangeActiveTextEditor(editor);
		this.updateContextState(editor);
	}

	public onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent): void {
		super.onDidChangeTextEditorSelection(event);
		this.updateContextState(event.textEditor);
	}

	private updateContextState(editor: TextEditor | undefined) {
		const document = editor?.document;
		const selection = editor?.selection;

		if(!document?.languageId) {
			this.setState(false);
		}
		else if(document.languageId !== 'markdown' && document.languageId !== 'mdx' && document.languageId !== 'quarto') {
			this.setState(false);
		}
		else if(selection) {
			const newState = isInTable(document.getText(), selection.start.line, selection.end.line);

			this.setState(newState);
		}
		else {
			this.setState(false);
		}
	}
}
