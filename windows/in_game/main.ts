import Player from '../../classes/Player';
import * as $ from 'jquery';

const onDeath: Function = () => {
  console.log('noob');
};

const update: Function = (player: Player, gameInfo: object, phase: string) => {
  $('#shield').text(player.shield.toString());
  $('#health').text(player.health.toString());

  $('#wood').text(player.getMaterialCount('Wood').toString());
  $('#brick').text(player.getMaterialCount('Brick').toString());
  $('#metal').text(player.getMaterialCount('Metal').toString());
};

export default {
  onDeath,
  update,
};
