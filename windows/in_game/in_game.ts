import '../../scss/main.scss';

import { AppWindow } from "../AppWindow";
import { OWGamesEvents } from "../../odk-ts/ow-games-events";
import { OWHotkeys } from "../../odk-ts/ow-hotkeys";
import { interestingFeatures, hotkeys, windowNames } from "../../consts";
import Player from '../../classes/Player';
import Item from "../../classes/item";
import events from './main';
import WindowState = overwolf.windows.WindowState;
import main from "./main";
import Vector3 from '../../classes/Vector3';

// The window displayed in-game while a Fortnite game is running.
// It listens to all info events and to the game events listed in the consts.ts file
// and writes them to the relevant log using <pre> tags.
// The window also sets up Ctrl+F as the minimize/restore hotkey.
// Like the background window, it also implements the Singleton design pattern.
class InGame extends AppWindow {
  private static _instance: InGame;
  private _fortniteGameEventsListener: OWGamesEvents;
  private player: Player = new Player();
  private lastInventory: object = {};
  private matchInfo = {};
  private phase: string = '';

  private constructor() {
    super(windowNames.inGame);

    this.setToggleHotkeyBehavior();
    this.setToggleHotkeyText();

    this._fortniteGameEventsListener = new OWGamesEvents({
      onInfoUpdates: this.onInfoUpdates.bind(this),
      onNewEvents: this.onNewEvents.bind(this)
    },
      interestingFeatures);
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new InGame();
    }

    return this._instance;
  }

  public run() {
    this._fortniteGameEventsListener.start();
  }

  private onInfoUpdates(info) {
    Object.keys(info).forEach((eventName: string) => {
      if (eventName === 'inventory') {
        Object.keys(info.inventory).forEach((item: string) => {
          const index: number = parseInt(item.replace('item_', ''), 10)

          this.onInventory(index, JSON.parse(info.inventory[`item_${index}`]));
        })
      }

      if (eventName === 'quickbar') {
        Object.keys(info.quickbar).forEach((item: string) => {
          console.log(info);
          const index: number = parseInt(item.replace('quickbar_', ''), 10)

          this.onQuickbar(index, info.quickbar[item], info.quickbar[item] ? JSON.parse(info.quickbar[item]).name : null);
        })
      }

      if (eventName === 'me') {
        this.onMe(info.me);
      }

      if (eventName === 'selected_slot') {
        this.onSelectSlot(JSON.parse(info.selected_slot.selected_slot));
      }

      if (eventName === 'selected_material') {
        this.onSelectMaterial(parseInt(info.selected_material.selected_material));
      }

      if (eventName === 'match_info') {
        this.onMatchInfo(info.match_info);
      }

      if (eventName === 'game_info') {
        Object.keys(info.game_info).forEach((gameInfo: string) => {
          if (gameInfo === 'location') {
            this.onLocation(JSON.parse(info.game_info.location));
          }

          if (gameInfo === 'phase') {
            this.onPhase(info.game_info.phase);
          }
        })
      }
    });

    events.update(this.player, this.matchInfo, this.phase);
  }

  private onLocation(location: Vector3) {
    this.player.location = location;
  }

  private onPhase(phase: string) {
    this.phase = phase;
  }

  private onSelectSlot(selectData) {
    this.player.selected_slot = selectData;
  }

  private onMatchInfo(selectData: Object) {
    this.matchInfo = {
      ...this.matchInfo,
      ...selectData,
    };
  }

  private onSelectMaterial(selectData: number) {
    this.player.selectedMaterial = selectData;
  }

  private onMe(data) {
    this.player.health = parseInt(data.health || this.player.health, 10);
    this.player.shield = parseInt(data.shield || this.player.shield, 10);
    this.player.name = data.name || this.player.name;
    this.player.accuracy = data.accuracy || this.player.accuracy;
  }

  private onQuickbar(index: number, empty: boolean, name: string) {
    if (empty) {
      this.player.hotbar[index] = null;
    } {
      this.player.hotbar[index] = this.player.inventory[this.lastInventory[name]];
    }
  }

  private onInventory(index: number, data) {
    if (data) {
      this.lastInventory[data.name] = index;

      if (this.player.inventory[index] && this.player.inventory[index].name === data.name) {
        this.player.inventory[index].count = data.count;
        this.player.inventory[index].ammo = data.ammo;
      } else {
        this.player.inventory[index] = new Item(data.name, parseInt(data.count), parseInt(data.ammo), parseInt(data.rarity))
      }
    } else {
      this.player.inventory[index] = null;
    }
  }

  // Special events will be highlighted in the event log
  private onNewEvents(e) {
    console.log(JSON.stringify(e));
    e.events.forEach((event) => {
      if (event.name === 'killed') {
        if (main.onKill) {
          main.onKill(this.player, event.data, this.matchInfo['kills'])
        }
      }

      if (event.name === 'matchStart') {
        if (main.onStart) {
          main.onStart(this.player);
        }
      }

      if (event.name === 'killer') {
        if (main.onDeath) {
          main.onDeath(this.player, event.data);
        }
      }

      if (event.name === 'revived') {
        if (main.onRevived) {
          main.onRevived(this.player);
        }
      }

      if (event.name === 'team') {
        if (main.onTeam) {
          main.onTeam(this.player, JSON.parse(event.data.value.map((teammate) => teammate.player)))
        }
      }

      if (event.name === 'phase') {
        if (main.onPhase) {
          main.onPhase(this.player, event.data.phase);
        }
      }

      if (event.name === 'knockedout') {
        if (main.onKnockedDown) {
          main.onKnockedDown(this.player, event.data);
        }
      }
    });
  }

  // Displays the toggle minimize/restore hotkey in the window header
  private async setToggleHotkeyText() {
    const hotkeyText = await OWHotkeys.getHotkeyText(hotkeys.toggle);
    const hotkeyElem = document.getElementById('hotkey');
    hotkeyElem.textContent = hotkeyText;
  }

  // Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
  private async setToggleHotkeyBehavior() {
    const toggleInGameWindow = async hotkeyResult => {
      console.log(`pressed hotkey for ${hotkeyResult.featureId}`);
      const inGameState = await this.getWindowState();

      if (inGameState.window_state === WindowState.NORMAL ||
        inGameState.window_state === WindowState.MAXIMIZED) {
        this.currWindow.minimize();
      } else if (inGameState.window_state === WindowState.MINIMIZED ||
        inGameState.window_state === WindowState.CLOSED) {
        this.currWindow.restore();
      }
    }

    OWHotkeys.onHotkeyDown(hotkeys.toggle, toggleInGameWindow);
  }
}

InGame.instance().run();
