import { type ExtensionContext, window, type Disposable, type ConfigurationChangeEvent, type TextEditor, type TextEditorSelectionChangeEvent, workspace } from 'vscode';
import { type ContextService } from './context-service.js';
import { TextEditorContextServiceCursorInTable } from './text-editor-context-service-cursor-in-table.js';
import { TextEditorContextServiceIsSupportedLanguage } from './text-editor-context-service-is-supported-language.js';
import { WorkspaceBooleanConfigurationContextService } from './workspace-boolean-configuration-context-service.js';

export class ContextServiceManager implements Disposable {
	private readonly contextServices: ContextService[] = [];

	public constructor() {
		// push context services
		this.contextServices.push(
			new TextEditorContextServiceCursorInTable('markdownTableSort.contextkey.selection.InMarkdownTable', false),
			new TextEditorContextServiceIsSupportedLanguage('markdownTableSort.contextkey.active.IsSupportedLanguage', false),
			new WorkspaceBooleanConfigurationContextService('markdownTableSort.contextkey.config.showMenu.sortTextAsc', 'markdownTableSort.showMenu.sortTextAsc'),
			new WorkspaceBooleanConfigurationContextService('markdownTableSort.contextkey.config.showMenu.sortTextDesc', 'markdownTableSort.showMenu.sortTextDesc'),
			new WorkspaceBooleanConfigurationContextService('markdownTableSort.contextkey.config.showMenu.sortNumberAsc', 'markdownTableSort.showMenu.sortNumberAsc'),
			new WorkspaceBooleanConfigurationContextService('markdownTableSort.contextkey.config.showMenu.sortNumberDesc', 'markdownTableSort.showMenu.sortNumberDesc'),
		);
	}

	public activate(context: ExtensionContext) {
		for(const service of this.contextServices) {
			service.onActivate(context);
		}

		// subscribe update handler for context
		context.subscriptions.push(
			this,
			window.onDidChangeActiveTextEditor((editor) => this.onDidChangeActiveTextEditor(editor)),
			window.onDidChangeTextEditorSelection((event) => this.onDidChangeTextEditorSelection(event)),
			workspace.onDidChangeConfiguration((event) => this.onDidChangeConfiguration(event)),
		);
	}

	public dispose(): void {
		while(this.contextServices.length > 0) {
			const service = this.contextServices.pop();
			service!.dispose();
		}
	}

	private onDidChangeActiveTextEditor(editor: TextEditor | undefined): void {
		for(const service of this.contextServices) {
			service.onDidChangeActiveTextEditor(editor);
		}
	}

	private onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent): void {
		for(const service of this.contextServices) {
			service.onDidChangeTextEditorSelection(event);
		}
	}

	private onDidChangeConfiguration(event: ConfigurationChangeEvent): void {
		for(const service of this.contextServices) {
			service.onDidChangeConfiguration(event);
		}
	}
}
