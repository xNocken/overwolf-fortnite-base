import Player from "../../classes/Player";

export default {
  onStart: (player: Player) => {},
  onRevived: (player: Player) => {},
  onDeath: (player: Player, name: string) => {},
  onKill: (player: Player, user: string, kills: number) => {},
  update: (player: Player, gameInfo: object, phase: string) => {},
  onEnd: (player: Player, matchInfo: Object, placement: Number) => {},
  onKnockedDown: (player: Player, killer: String) => {},
  onPhase: (player: Player, phase: String) => {},
  onTeam: (player: Player, teams: Array<String>) => {},
};
