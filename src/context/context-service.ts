import { type Disposable, commands, type ExtensionContext, type ConfigurationChangeEvent, type TextEditor, type TextEditorSelectionChangeEvent } from 'vscode';

export class ContextService implements Disposable {
	protected readonly contextName: string;

	constructor(contextName: string) {
		this.contextName = contextName;
	}

	/**
	 * activate context service
	 * @param context ExtensionContext
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public onActivate(context: ExtensionContext): void { }

	/**
	 * Dispose this object.
	 * Override this method to dispose objects those the extend class has.
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public dispose(): void { }

	/**
	 * Default handler of onDidChangeActiveTextEditor, do nothing.
	 * Override this method to handle that event to update context state.
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public onDidChangeActiveTextEditor(editor: TextEditor | undefined): void { }

	/**
	 * default handler of onDidChangeTextEditorSelection, do nothing.
	 * Override this method to handle that event to update context state.
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent): void { }

	/**
	 * Default handler of an event that is emitted when the {@link WorkspaceConfiguration configuration} changed.
	 * Override this method to handle that event to update context state.
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public onDidChangeConfiguration(event: ConfigurationChangeEvent): void { }

	/**
	 * set state of context
	 */
	protected setState(state: any) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		commands.executeCommand('setContext', this.contextName, state);
	}
}
