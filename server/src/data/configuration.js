export const DIFFICULTIES = {
  easy: { rooms: 3, minutes: 30, hints: 5 }, medium: { rooms: 4, minutes: 25, hints: 4 }, hard: { rooms: 5, minutes: 20, hints: 3 }
};
export const THEMES = [
  { id: 'haunted_mansion', name: 'Haunted Mansion', text: 'An abandoned mansion full of concealed rooms and strange histories.', icon: '♜' },
  { id: 'ancient_temple', name: 'Ancient Temple', text: 'Symbols, mechanisms, and forgotten chambers beneath the stone.', icon: '◇' },
  { id: 'secret_laboratory', name: 'Secret Laboratory', text: 'A restricted research facility with disrupted systems.', icon: '⌬' },
  { id: 'pirate_ship', name: 'Pirate Ship', text: 'A weathered ship, locked chests, and a captain’s secret.', icon: '⚓' },
  { id: 'space_station', name: 'Space Station', text: 'Restore power, access, and navigation aboard a damaged station.', icon: '✧' },
  { id: 'cyber_vault', name: 'Cyber Vault', text: 'A physical vault guarded by codes and logic mechanisms.', icon: '▦' },
  { id: 'custom_adventure', name: 'Custom Adventure', text: 'Set a premise and let the story take shape around it.', icon: '✳' }
];
