import { type ExtensionContext, type TextDocument, type TextEditor, type TextEditorSelectionChangeEvent } from 'vscode';
import { ContextService } from './context-service.js';

export class TextEditorContextServiceIsSupportedLanguage extends ContextService {
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
		const newState = this.isSupportedLanguage(document);

		this.setState(newState);
	}

	private isSupportedLanguage(document: TextDocument | undefined): boolean {
		if(!document?.languageId) {
			return false;
		}

		return document.languageId === 'markdown' || document.languageId === 'mdx' || document.languageId === 'quarto';
	}
}
