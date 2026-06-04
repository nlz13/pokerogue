import { globalScene } from "#app/global-scene";
import { PokeballType } from "#enums/pokeball";
import { NumberHolder } from "#utils/common";
import i18next from "i18next";

export const MAX_PER_TYPE_POKEBALLS: number = 99;

export function getPokeballAtlasKey(type: PokeballType): string {
  return ["pb", "gb", "ub", "rb", "mb", "lb"][type];
}

export function getPokeballName(type: PokeballType): string {
  let ret: string;
  switch (type) {
    case PokeballType.MASTER_BALL:
      ret = i18next.t("pokeball:masterBall");
      break;
    case PokeballType.ULTRA_BALL:
      ret = i18next.t("pokeball:ultraBall");
      break;
    case PokeballType.ROGUE_BALL:
      ret = i18next.t("pokeball:rogueBall");
      break;
    case PokeballType.GREAT_BALL:
      ret = i18next.t("pokeball:greatBall");
      break;
    case PokeballType.LUXURY_BALL:
      ret = i18next.t("pokeball:luxuryBall");
      break;
    default:
      ret = i18next.t("pokeball:pokeBall");
      break;
  }
  return ret;
}

export function getPokeballCatchMultiplier(type: PokeballType): number {
  // nlz v2: all balls guaranteed catch (same as Master Ball)
  switch (type) {
    case PokeballType.POKEBALL:
      return -1;
    case PokeballType.GREAT_BALL:
      return -1;
    case PokeballType.ULTRA_BALL:
      return -1;
    case PokeballType.ROGUE_BALL:
      return -1;
    case PokeballType.MASTER_BALL:
      return -1;
    case PokeballType.LUXURY_BALL:
      return -1;
  }
}

export function getPokeballTintColor(type: PokeballType): number {
  switch (type) {
    case PokeballType.MASTER_BALL:
      return 0xb0a0c8;
    case PokeballType.ULTRA_BALL:
      return 0xf8d030;
    case PokeballType.ROGUE_BALL:
      return 0xd8a0a8;
    case PokeballType.GREAT_BALL:
      return 0x80b8f0;
    case PokeballType.LUXURY_BALL:
      return 0xf8b060;
    default:
      return 0xf8f8f8;
  }
}

export function getCriticalCaptureChance(modifiedCatchRate: number): number {
  if (!globalScene.gameData.unlocks.CRITICAL_CAPTURE_CHANCE) {
    return 0;
  }
  const dexCount = globalScene.gameData.getSpeciesCount(d => !!d.caughtAttr);
  const baseChance = Math.round(modifiedCatchRate * 2.5);
  if (dexCount < 30) {
    return Math.floor(baseChance / 6);
  }
  if (dexCount < 150) {
    return Math.floor(baseChance / 4);
  }
  if (dexCount < 300) {
    return Math.floor(baseChance / 2);
  }
  if (dexCount < 450) {
    return Math.floor((baseChance * 3) / 4);
  }
  return baseChance;
}

export function doPokeballBounceAnim(
  pokeball: Phaser.GameObjects.Sprite,
  startY: number,
  endY: number,
  duration: number,
  callback: Function,
  isCritical = false,
) {
  let bouncePeak = 0;
  const baseY = endY;
  globalScene.tweens.add({
    targets: pokeball,
    y: { value: startY, ease: "Cubic.easeOut" },
    duration: duration / 2,
    onComplete: () => {
      globalScene.tweens.add({
        targets: pokeball,
        y: { value: baseY, ease: "Bounce.easeOut" },
        duration: duration / 2,
        onUpdate: (tween: Phaser.Tweens.Tween) => {
          const progress = tween.progress;
          const y = pokeball.y;
          if (y < bouncePeak) {
            bouncePeak = y;
          } else if (bouncePeak < 0 && y > bouncePeak) {
            bouncePeak = 0;
          }
        },
        onComplete: () => callback(),
      });
    },
  });
}
