export type Letter = 'x' | 'o' | ''

export type GameState = {
  1: Letter
  2: Letter
  3: Letter
  4: Letter
  5: Letter
  6: Letter
  7: Letter
  8: Letter
  9: Letter
}

export type Combination = [keyof GameState, keyof GameState, keyof GameState]
