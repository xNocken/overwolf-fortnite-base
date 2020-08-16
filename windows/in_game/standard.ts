import Player from "../../classes/Player";

export default {
  onDeath: (player, name) => {},
  onKill: (player, user, kills) => {},
  update: (player: Player, gameInfo: object, phase: string) => {},
};
