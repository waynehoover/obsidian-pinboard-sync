import { App, PluginSettingTab, Setting } from "obsidian";

import type PinboardSyncPlugIn from "./main";

export const DEFAULT_SECTION_HEADING = "## Pinboard";
export const DEFAULT_SYNC_FREQUENCY_SECONDS = 30 * 60; // Every 30 minutes
export const DEFAULT_TAG_PREFIX = "pinboard/";
export const DEFAULT_PIN_TOKEN = "Username:SecretTokenCode";
export const DEFAULT_RECENT_COUNT = 20;

export interface ISettings {
  apiToken: string;
  hasAcceptedDisclaimer: boolean;
  latestSyncTime: number;
  isSyncEnabled: boolean;
  syncInterval: number;
  tagPrefix: string;
  recentCount: number;
  singleFileNoteName: string;
}

export const DEFAULT_SETTINGS = Object.freeze({
  apiToken: DEFAULT_PIN_TOKEN,
  hasAcceptedDisclaimer: false,
  latestSyncTime: 0,
  isSyncEnabled: false,
  syncInterval: DEFAULT_SYNC_FREQUENCY_SECONDS,
  tagPrefix: DEFAULT_TAG_PREFIX,
  recentCount: DEFAULT_RECENT_COUNT,
  singleFileNoteName: "Pinboard Pins",
});

export class PinboardSyncSettingsTab extends PluginSettingTab {
  private plugin: DailyPinboardPlugIn;

  constructor(app: App, plugin: DailyPinboardPlugIn) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    this.containerEl.empty();
    this.containerEl.createEl("h3", {
      text: "Pinboard",
    });
    this.addApiTokenSetting();

    this.containerEl.createEl("h3", {
      text: "Format",
    });
    this.addTagPrefixSetting();

    this.containerEl.createEl("h3", {
      text: "Sync",
    });
    this.addSyncEnabledSetting();
    this.addSyncIntervalSetting();
    this.addRecentCountSetting();
    this.addSingleFileNoteNameSetting();
  }

  addApiTokenSetting(): void {
    new Setting(this.containerEl)
      .setName("Token")
      .setDesc("Pinboard API Token")
      .addText((textfield) => {
        textfield.setValue(this.plugin.settings.apiToken);
        textfield.onChange(async (rawApiToken) => {
          const apiToken = rawApiToken.trim();
          this.plugin.writeSettings({ apiToken });
        });
      });
  }

  addRecentCountSetting(): void {
    new Setting(this.containerEl)
      .setName("Recent Posts")
      .setDesc("Number of recent posts the plugin will read to sync")
      .addText((textfield) => {
        textfield.setValue(String(this.plugin.settings.recentCount));
        textfield.inputEl.type = "number";
        textfield.inputEl.onblur = (e: FocusEvent) => {
          const recentCount = Number((<HTMLInputElement>e.target).value);
          textfield.setValue(String(recentCount));
          this.plugin.writeSettings({ recentCount });
        };
      });
  }

  addTagPrefixSetting(): void {
    new Setting(this.containerEl)
      .setName("Tag Prefix")
      .setDesc(
        "Prefix added to Pinboard tags when imported into Obsidian (e.g. #pinboard/work)"
      )
      .addText((textfield) => {
        textfield.setValue(this.plugin.settings.tagPrefix);
        textfield.onChange(async (tagPrefix) => {
          this.plugin.writeSettings({ tagPrefix });
        });
      });
  }

  addSyncEnabledSetting(): void {
    new Setting(this.containerEl)
      .setName("Enable periodic syncing")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.isSyncEnabled);
        toggle.onChange(async (isSyncEnabled) => {
          this.plugin.writeSettings({ isSyncEnabled });
        });
      });
  }

  addSyncIntervalSetting(): void {
    new Setting(this.containerEl)
      .setName("Sync Frequency")
      .setDesc("Number of seconds the plugin will wait before syncing again")
      .addText((textfield) => {
        textfield.setValue(String(this.plugin.settings.syncInterval));
        textfield.inputEl.type = "number";
        textfield.inputEl.onblur = (e: FocusEvent) => {
          const syncInterval = Number((<HTMLInputElement>e.target).value);
          textfield.setValue(String(syncInterval));
          this.plugin.writeSettings({ syncInterval });
        };
      });
  }

  addSingleFileNoteNameSetting(): void {
    new Setting(this.containerEl)
      .setName("Single File Name")
      .setDesc("Name of the file where all Pinboard pins will be stored")
      .addText((textfield) => {
        textfield.setValue(this.plugin.settings.singleFileNoteName);
        textfield.onChange(async (singleFileNoteName) => {
          this.plugin.writeSettings({ singleFileNoteName });
        });
      });
  }
}
