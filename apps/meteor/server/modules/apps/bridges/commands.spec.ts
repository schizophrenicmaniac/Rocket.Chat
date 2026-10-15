import type { IAppServerOrchestrator } from '@rocket.chat/apps';
import type { ISlashCommand } from '@rocket.chat/apps-engine/definition/slashcommands';
import type { SlashCommand } from '@rocket.chat/core-typings';

import { AppCommandsBridge } from './commands';
import { slashCommands } from '../../../lib/utils/slashCommand';

jest.mock('../../../lib/utils/slashCommand', () => ({ slashCommands: { commands: {} } }));

const orch = {
	debugLog: jest.fn(),
	getNotifier: () => ({ commandUpdated: jest.fn() }),
} as unknown as IAppServerOrchestrator;

class TestAppCommandsBridge extends AppCommandsBridge {
	public override modifyCommand(command: ISlashCommand, appId: string): Promise<void> {
		return super.modifyCommand(command, appId);
	}
}

const makeAppCommand = (overrides: Partial<ISlashCommand> = {}): ISlashCommand =>
	({
		command: 'topic',
		i18nParamsExample: '',
		i18nDescription: '',
		providesPreview: false,
		executor: jest.fn(),
		...overrides,
	}) as ISlashCommand;

describe('AppCommandsBridge', () => {
	describe('modifyCommand', () => {
		let bridge: TestAppCommandsBridge;

		beforeEach(() => {
			bridge = new TestAppCommandsBridge(orch);
			slashCommands.commands.topic = {
				command: 'topic',
				params: 'Topic',
				description: 'Set_the_topic_of_the_room',
				clientOnly: false,
				providesPreview: false,
				callback: jest.fn(),
			} as unknown as SlashCommand;
		});

		afterEach(() => {
			delete slashCommands.commands.topic;
		});

		it('should keep the existing description and params when the app provides neither', async () => {
			await bridge.modifyCommand(makeAppCommand(), 'app-id');

			expect(slashCommands.commands.topic.description).toBe('Set_the_topic_of_the_room');
			expect(slashCommands.commands.topic.params).toBe('Topic');
		});

		it('should keep the existing description when the app only provides params', async () => {
			await bridge.modifyCommand(makeAppCommand({ i18nParamsExample: 'app_topic_params' }), 'app-id');

			expect(slashCommands.commands.topic.description).toBe('Set_the_topic_of_the_room');
			expect(slashCommands.commands.topic.params).toBe('app_topic_params');
		});

		it('should replace the description when the app provides one', async () => {
			await bridge.modifyCommand(makeAppCommand({ i18nDescription: 'app_topic_description' }), 'app-id');

			expect(slashCommands.commands.topic.description).toBe('app_topic_description');
			expect(slashCommands.commands.topic.params).toBe('Topic');
		});
	});
});
