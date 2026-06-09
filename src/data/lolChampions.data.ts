/**
 * Sous-ensemble curé de ~45 champions populaires pour le sélecteur d'icône d'équipe.
 * La clé est passée à championIcon(key) de lolAssets.ts pour construire l'URL d'image.
 * À remplacer par Data Dragon complet une fois la base de données connectée.
 */

export interface LolChampionEntry {
  key:   string;
  label: string;
}

export const LOL_CHAMPIONS: LolChampionEntry[] = [
  { key: 'Aatrox',       label: 'Aatrox' },
  { key: 'Ahri',         label: 'Ahri' },
  { key: 'Akali',        label: 'Akali' },
  { key: 'Alistar',      label: 'Alistar' },
  { key: 'Ashe',         label: 'Ashe' },
  { key: 'Blitzcrank',   label: 'Blitzcrank' },
  { key: 'Caitlyn',      label: 'Caitlyn' },
  { key: 'Darius',       label: 'Darius' },
  { key: 'Diana',        label: 'Diana' },
  { key: 'Draven',       label: 'Draven' },
  { key: 'Ekko',         label: 'Ekko' },
  { key: 'Ezreal',       label: 'Ezreal' },
  { key: 'Fiora',        label: 'Fiora' },
  { key: 'Fizz',         label: 'Fizz' },
  { key: 'Garen',        label: 'Garen' },
  { key: 'Graves',       label: 'Graves' },
  { key: 'Hecarim',      label: 'Hecarim' },
  { key: 'Irelia',       label: 'Irelia' },
  { key: 'Janna',        label: 'Janna' },
  { key: 'Jarvan',       label: 'Jarvan IV' },
  { key: 'Jax',          label: 'Jax' },
  { key: 'Jinx',         label: 'Jinx' },
  { key: 'Kaisa',        label: "Kai'Sa" },
  { key: 'Kassadin',     label: 'Kassadin' },
  { key: 'Katarina',     label: 'Katarina' },
  { key: 'KogMaw',       label: "Kog'Maw" },
  { key: 'LeeSin',       label: 'Lee Sin' },
  { key: 'Lux',          label: 'Lux' },
  { key: 'Malphite',     label: 'Malphite' },
  { key: 'MissFortune',  label: 'Miss Fortune' },
  { key: 'Morgana',      label: 'Morgana' },
  { key: 'Nami',         label: 'Nami' },
  { key: 'Nautilus',     label: 'Nautilus' },
  { key: 'Nidalee',      label: 'Nidalee' },
  { key: 'Orianna',      label: 'Orianna' },
  { key: 'Pantheon',     label: 'Pantheon' },
  { key: 'Riven',        label: 'Riven' },
  { key: 'Ryze',         label: 'Ryze' },
  { key: 'Sejuani',      label: 'Sejuani' },
  { key: 'Thresh',       label: 'Thresh' },
  { key: 'Tristana',     label: 'Tristana' },
  { key: 'Vayne',        label: 'Vayne' },
  { key: 'Vi',           label: 'Vi' },
  { key: 'Yasuo',        label: 'Yasuo' },
  { key: 'Zed',          label: 'Zed' },
];
