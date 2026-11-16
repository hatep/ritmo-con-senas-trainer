// rhythm-data.js - Rhythmic signs, levels, and solfege dictionaries

export const BINARY_LEVELS = {
  1: {
    name: "Level 1 (Easy - 4 signs)",
    signs: ["0000", "1000", "1010", "1111"]
  },
  2: {
    name: "Level 2 (Medium - 10 signs)",
    signs: [
      "0000", "1000", "1010", "1111", 
      "1100", "1001", "0110", "0010", "1110", "1011"
    ]
  },
  3: {
    name: "Level 3 (Hard - All 16 signs)",
    signs: [
      "0000", "1000", "1010", "1111", 
      "1100", "1001", "0110", "0010", "1110", "1011",
      "0100", "0001", "0101", "0011", "0111", "1101"
    ]
  }
};

export const TERNARY_LEVELS = {
  1: {
    name: "Level 1 (Easy - 3 signs)",
    signs: ["000", "100", "111"]
  },
  2: {
    name: "Level 2 (Medium - 5 signs)",
    signs: ["000", "100", "111", "101", "110"]
  },
  3: {
    name: "Level 3 (Hard - All 8 signs)",
    signs: ["000", "100", "111", "101", "110", "001", "010", "011"]
  }
};

export const SOLFEGE_LABELS = {
  binary: {
    numbers: ["1", "2", "3", "4"],
    solfege: ["Ta", "Ka", "Di", "Mi"],
    hidden: ["", "", "", ""]
  },
  ternary: {
    numbers: ["1", "2", "3"],
    solfege: ["Ta", "Ki", "Da"],
    hidden: ["", "", ""]
  }
};

export function getRandomSign(mode, level) {
  const dictionary = mode === 'ternary' ? TERNARY_LEVELS : BINARY_LEVELS;
  const signs = dictionary[level]?.signs || dictionary[1].signs;
  const index = Math.floor(Math.random() * signs.length);
  return signs[index];
}
