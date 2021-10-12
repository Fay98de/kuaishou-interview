import path from 'path'
import NReadLines from 'n-readlines'

function isValidLine(line: string) {
  return /([^;]+;){2}(win|loss|draw)/.test(line.trim())
}

export default function tally(filePath: string) {
  const record: Record<string, Record<string, number>> = {}
  const absFilePath = path.resolve(__dirname, filePath)
  const liner = new NReadLines(absFilePath)
  let line: false | Buffer
  let maxTeamNameCount = 0

  while ((line = liner.next())) {
    const text = line.toString()
    if (!isValidLine(text)) continue
    const arr = text.split(';')
    const team1 = arr[0].trim()
    const team2 = arr[1].trim()
    const result = arr[2].trim()
    record[team1] = record[team1] || { W: 0, D: 0, L: 0, P: 0 }
    record[team2] = record[team2] || { W: 0, D: 0, L: 0, P: 0 }
    maxTeamNameCount = Math.max(maxTeamNameCount, team1.length, team2.length)

    switch (result) {
      case 'win':
        record[team1].W++
        record[team2].L++
        record[team1].P += 3
        break
      case 'draw':
        record[team1].D++
        record[team2].D++
        record[team1].P++
        record[team2].P++
        break
      case 'loss':
        record[team1].L++
        record[team2].W++
        record[team2].P += 3
    }
  }

  const sortedTeams = Object.keys(record).sort((team1, team2) => {
    if (record[team1].P !== record[team2].P) return record[team2].P - record[team1].P
    return team1 > team2 ? 1 : team1 < team2 ? -1 : 0
  })

  let output = `Team ${' '.repeat(maxTeamNameCount - 4)}| MP |  W |  D |  L |  P `

  for (let team of sortedTeams) {
    output += `\n${team} ${' '.repeat(maxTeamNameCount - team.length)}|  ${
      record[team].W + record[team].D + record[team].L
    } |  ${record[team].W} |  ${record[team].D} |  ${record[team].L} |  ${record[team].P} `
  }

  return output
}
