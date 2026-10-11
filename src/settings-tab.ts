// The settings screen of the plugin, in the settings of Obsidian. It has the look of Obsidian and
// not the look of the kitchen, so that it is the same as each other settings screen.

import { AbstractInputSuggest, PluginSettingTab, Setting, type App, type Plugin } from 'obsidian';
import { Alarm, type Sound } from './cook/alarm';
import type { Kitchen } from './kitchen-state.svelte';
import type { Settings } from './settings';

// Proposes paths of the vault, or other texts, while you type.
class TextSuggest extends AbstractInputSuggest<string> {
	private texts: () => string[];

	constructor(app: App, field: HTMLInputElement, texts: () => string[]) {
		super(app, field);
		this.texts = texts;
	}

	protected getSuggestions(query: string): string[] {
		const words = query.toLowerCase();
		return this.texts().filter((text) => text.toLowerCase().includes(words));
	}

	renderSuggestion(text: string, el: HTMLElement) {
		el.setText(text);
	}
}

type TextKey = 'recipesFolder' | 'pantryFolder' | 'planNote' | 'newPlace' | 'fontName';
type NumberKey = 'volume' | 'soonDays' | 'lowPercent';
type SwitchKey = 'vibrate' | 'keepScreenOn';

const days = (count: number) => `${count} ${count === 1 ? 'day' : 'days'}`;

export class KitchenSettingTab extends PluginSettingTab {
	private kitchen: Kitchen;
	// The sound of the "Test" button.
	private alarm = new Alarm();

	constructor(app: App, plugin: Plugin, kitchen: Kitchen) {
		super(app, plugin);
		this.kitchen = kitchen;
	}

	display() {
		const { containerEl, kitchen } = this;
		const { vault } = this.app;
		const folders = () => vault.getAllFolders().map((folder) => folder.path);
		const notes = () => vault.getMarkdownFiles().map((file) => file.path);
		containerEl.empty();

		this.heading('Notes');
		this.text(
			'recipesFolder',
			'Recipes folder',
			'Only the notes in this folder are recipes. With no folder, the plugin tries each note of the vault.',
			'All notes',
			folders
		);
		this.text(
			'pantryFolder',
			'Pantry folder',
			'Each note in this folder is a food item.',
			'Pantry',
			folders
		);
		this.text(
			'planNote',
			'Meal plan note',
			'The note with the meals of the week.',
			'Meal plan.md',
			notes
		);
		this.text(
			'newPlace',
			'Place for new food',
			'Food from a shopping trip goes to this place, when the pantry does not have that food item yet.',
			'Kitchen',
			() => kitchen.places
		);

		this.heading('Look');
		new Setting(containerEl)
			.setName('Font for titles and numbers')
			.setDesc('All other text has the font of Obsidian.')
			.addDropdown((list) =>
				list
					.addOptions({
						bricolage: 'Bricolage Grotesque',
						obsidian: 'Font of Obsidian',
						device: 'A font of this device'
					})
					.setValue(kitchen.settings.font)
					.onChange((value) => {
						this.change({ font: value as Settings['font'] });
						// The field for the name of the font shows only for a font of the device.
						this.display();
					})
			);
		if (kitchen.settings.font === 'device') {
			this.text(
				'fontName',
				'Font name',
				'The name of a font that is on this device. A device that does not have the font shows Bricolage Grotesque.',
				'Georgia'
			);
		}
		new Setting(containerEl)
			.setName('Accent colour')
			.setDesc(
				'The colour of "ready", "done", and the current step. The accent colour of Obsidian comes from your theme, or from the Appearance settings.'
			)
			.addDropdown((list) =>
				list
					.addOptions({ olive: 'Larder olive', obsidian: 'Accent colour of Obsidian' })
					.setValue(kitchen.settings.accent)
					.onChange((value) => this.change({ accent: value as Settings['accent'] }))
			);

		this.heading('Cook Mode');
		new Setting(containerEl)
			.setName('Timer sound')
			.setDesc('The sound when a timer ends. It repeats until you tap "OK".')
			.addDropdown((list) =>
				list
					.addOptions({ beeps: 'Beeps', chime: 'Chime', off: 'No sound' })
					.setValue(kitchen.settings.sound)
					.onChange((value) => this.change({ sound: value as Sound }))
			)
			.addButton((button) =>
				button.setButtonText('Test').onClick(() => this.alarm.once(kitchen.settings))
			);
		this.slider('volume', 'Volume', (value) => `${value} of 10.`, 1, 10, 1);
		this.switch('vibrate', 'Vibrate', 'A phone that can vibrate does so when a timer ends.');
		this.switch(
			'keepScreenOn',
			'Keep the screen on',
			'The screen does not go dark while Cook Mode is open.'
		);

		this.heading('Pantry');
		this.slider(
			'soonDays',
			'Use soon',
			(value) => `Food with a use-by date in ${days(value)} or less is food to use soon.`,
			1,
			14,
			1
		);
		this.slider(
			'lowPercent',
			'Low line',
			(value) => `A food item with no low line of its own is low below ${value}% of its full amount.`,
			5,
			50,
			5
		);
	}

	hide() {
		this.alarm.close();
	}

	private change(change: Partial<Settings>) {
		void this.kitchen.changeSettings(change);
	}

	private heading(name: string) {
		new Setting(this.containerEl).setName(name).setHeading();
	}

	// A text field. With a list of texts, the field proposes them while you type.
	private text(key: TextKey, name: string, desc: string, hint: string, texts?: () => string[]) {
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc)
			.addText((field) => {
				field
					.setPlaceholder(hint)
					.setValue(this.kitchen.settings[key])
					.onChange((value) => this.change({ [key]: value } as Partial<Settings>));
				if (!texts) return;

				const suggest = new TextSuggest(this.app, field.inputEl, texts);
				suggest.onSelect((text) => {
					field.setValue(text);
					this.change({ [key]: text } as Partial<Settings>);
					suggest.close();
				});
			});
	}

	// The description gives the value, because a slider shows no number.
	private slider(
		key: NumberKey,
		name: string,
		desc: (value: number) => string,
		min: number,
		max: number,
		step: number
	) {
		const setting = new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc(this.kitchen.settings[key]));
		setting.addSlider((slider) =>
			slider
				.setLimits(min, max, step)
				.setValue(this.kitchen.settings[key])
				.setDynamicTooltip()
				.onChange((value) => {
					setting.setDesc(desc(value));
					this.change({ [key]: value } as Partial<Settings>);
				})
		);
	}

	private switch(key: SwitchKey, name: string, desc: string) {
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.kitchen.settings[key])
					.onChange((value) => this.change({ [key]: value } as Partial<Settings>))
			);
	}
}
