import tally from './tournament'

describe(`tournament`, () => {
  test('input with all lines valid.', () => {
    const table = tally('./input-1.txt')
    expect(table).toBe(
      `Team                    | MP |  W |  D |  L |  P 
Devastating Donkeys     |  3 |  2 |  1 |  0 |  7 
Allegoric Alaskans      |  3 |  2 |  0 |  1 |  6 
Blithering Badgers      |  3 |  1 |  0 |  2 |  3 
Courageous Californians |  3 |  0 |  1 |  2 |  1 `
    )
  })

  test('input with invalid line.', () => {
    const table = tally('./input-2.txt')
    expect(table).toBe(
      `Team                    | MP |  W |  D |  L |  P 
Devastating Donkeys     |  3 |  2 |  1 |  0 |  7 
Allegoric Alaskans      |  3 |  2 |  0 |  1 |  6 
Blithering Badgers      |  3 |  1 |  0 |  2 |  3 
Courageous Californians |  3 |  0 |  1 |  2 |  1 `
    )
  })
})
