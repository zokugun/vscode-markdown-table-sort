import { type ConfigurationChangeEvent, type ExtensionContext, workspace } from 'vscode';
import { ContextService } from './context-service.js';

export class WorkspaceBooleanConfigurationContextService extends ContextService {
	private readonly configSectionDir: string;
	private readonly configSectionName: string;

	constructor(contextName: string, configSection: String) {
		super(contextName);
		this.configSectionDir = configSection.split('.').slice(0, -1).join('.');
		this.configSectionName = configSection.split('.').at(-1)!;
	}

	public onActivate(context: ExtensionContext) {
		super.onActivate(context);

		// set initial state of context
		const booleanValue = workspace.getConfiguration(this.configSectionDir).get(this.configSectionName)!;

		this.setState(booleanValue);
	}

	public onDidChangeConfiguration(event: ConfigurationChangeEvent): void {
		super.onDidChangeConfiguration(event);

		if(event.affectsConfiguration(this.configSectionDir + '.' + this.configSectionName)) {
			this.updateContextState();
		}
	}

	private updateContextState() {
		const booleanValue = workspace.getConfiguration(this.configSectionDir).get(this.configSectionName)!;

		this.setState(booleanValue);
	}
}
