import Player from '../../classes/Player';
import standard from './standard';

import * as $ from 'jquery';

const onStart: Function = (player: Player) => {
  console.log('start ', player.name);
};

const onRevived: Function = (player: Player) => {
  console.log('Revived ', player.name);
};

const onTeam: Function = (player: Player, teams: Array<String>) => {
  console.log('Teammmates:', teams.join(', '));
};

const onPhase: Function = (player: Player, phase: String) => {
  console.log('Phase:', phase);
};

const onEnd: Function = (player: Player, matchInfo: Object, placement: Number) => {
  console.log('Matchend:', `${placement}`);
};

const onKnockedDown: Function = (player: Player, killer: String) => {
  console.log('Knocked down:', killer);
};

const onDeath: Function = (player: Player, name) => {
  $('#deaths').append(`<div class="player-stats__entry player-stats__entry--gap">${name}</div>`)
};

const onKill: Function = (player: Player, name: string, kills: string) => {
  $('#kill-list').append(`<div class="player-stats__entry player-stats__entry--gap">${name}</div>`)
};

const update: Function = (player: Player, gameInfo: object, phase: string) => {
  $('#name').text(player.name);
  $('#shield').text(player.shield.toString());
  $('#health').text(player.health.toString());

  $('#wood').text(player.getMaterialCount('Wood').toString());
  $('#brick').text(player.getMaterialCount('Stone').toString());
  $('#metal').text(player.getMaterialCount('Metal').toString());

  $('#x').text(player.location.x.toString());
  $('#y').text(player.location.y.toString());
  $('#z').text(player.location.z.toString());

  $('#hotbar').empty();

  for (let i: number = 0; i < 6; i += 1) {
    if (player.hotbar[i]) {
      $('#hotbar').append(`<div class="player-stats__entry player-stats__entry--gap">Slot ${i}:
      <div class="player-stats__entry player-stats__entry--gap">Name: ${player.hotbar[i].name}</div>
      <div class="player-stats__entry player-stats__entry--gap">Ammo: ${player.hotbar[i].ammo}</div>
      <div class="player-stats__entry player-stats__entry--gap">Rarity: ${player.hotbar[i].rarity}</div>
      <div class="player-stats__entry player-stats__entry--gap">Count: ${player.hotbar[i].count}</div>
      </div>`)
    }
  }

  $('#inventory').empty();

  player.inventory.forEach((item) => {
    if (item) {
      $('#inventory').append(`<div>
        <div>${item.name}: </div>
        <div class="player-stats__entry player-stats__entry--gap">Rarity: ${item.rarity}</div>
        <div class="player-stats__entry player-stats__entry--gap">Ammo: ${item.ammo}</div>
        <div class="player-stats__entry player-stats__entry--gap">Count: ${item.count}</div>
      </div>`)
    }
  });

  $('#match-info').empty();
  Object.entries(gameInfo).forEach((info) => {
    $('#match-info').append(`<div class="player-stats__entry player-stats__entry--gap">${info[0]}: ${info[1]}</div>`);
  });

  $('#match-info').append(`<div class="player-stats__entry player-stats__entry--gap">Phase: ${phase}</div>`);

  $('#selected-slot').text(parseInt(player.selected_slot.slot) + (player.selected_slot.isPrimary ? 0 : 6));
  $('#selected-material').text(player.selectedMaterial);
  $('#accuracy').text(player.accuracy);
};

export default {
  ...standard,
  onKill,
  onDeath,
  onTeam,
  onStart,
  onRevived,
  onKnockedDown,
  onEnd,
  onPhase,
  update,
};
