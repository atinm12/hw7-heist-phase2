// Active powerups: X-Ray (X) and Stealth Mode (C).
//
// state.powerups says which are earned (see powerupsFor in game.js).
// state.powerFx = { xrayT, xrayCd, stealthT, stealthUses }, timers in seconds.
Heist.Powerups = (function () {
  const C = Heist.CONFIG;

  function init(state) {
    state.powerFx = { xrayT: 0, xrayCd: 0, stealthT: 0, stealthUses: C.STEALTH_USES };
  }

  function update(state, dt) {
    const fx = state.powerFx, I = Heist.Input, p = state.player;
    fx.xrayT = Math.max(0, fx.xrayT - dt);
    fx.xrayCd = Math.max(0, fx.xrayCd - dt);
    if (fx.stealthT > 0) {
      fx.stealthT -= dt;
      if (fx.stealthT <= 0) { fx.stealthT = 0; p.stealth = false; }
    }

    if (state.powerups.xray && I.wasPressed('x') && fx.xrayCd <= 0) {
      fx.xrayT = C.XRAY_TIME;
      fx.xrayCd = C.XRAY_COOLDOWN;
      Heist.Game.sfx('hack');
    }
    if (state.powerups.stealth && I.wasPressed('c') && fx.stealthT <= 0 && fx.stealthUses > 0) {
      fx.stealthUses--;
      fx.stealthT = C.STEALTH_TIME;
      p.stealth = true;
      Heist.Game.sfx('vent_down');
    }
  }

  function xrayOn(state) { return !!state.powerFx && state.powerFx.xrayT > 0; }

  return { init, update, xrayOn };
})();
