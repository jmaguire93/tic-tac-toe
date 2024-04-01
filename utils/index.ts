import { Combination, GameState } from '@/types'

export function checkMatch(value1: string, value2: string, value3: string) {
  if (value1 === '' || value2 === '' || value3 === '') {
    return false // Return false if any of the strings are empty
  }
  return value1 === value2 && value2 === value3
}

export function winningCombinations() {
  return [
    // rows
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    // columns
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    // diagonals
    [3, 5, 7],
    [1, 5, 9]
  ] as Combination[]
}

export function compareObjects(objOne: GameState, objTwo: GameState) {
  return JSON.stringify(objOne) === JSON.stringify(objTwo)
}
