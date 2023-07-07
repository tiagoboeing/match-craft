function generatePairs(players: string[]): [string, string][] {
  const pairs: [string, string][] = []

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const pair: [string, string] = [players[i], players[j]]
      pairs.push(pair)
    }
  }

  return pairs
}

function generateSchedule(players: string[]): [string, string][][] {
  const schedule: [string, string][][] = []
  const pairs = generatePairs(players)

  while (pairs.length > 0) {
    const round: [string, string][] = []
    const usedPlayers: string[] = []

    for (let i = pairs.length - 1; i >= 0; i--) {
      const pair = pairs[i]
      const [playerA, playerB] = pair

      if (!usedPlayers.includes(playerA) && !usedPlayers.includes(playerB)) {
        round.push(pair)
        usedPlayers.push(playerA, playerB)
        pairs.splice(i, 1)
      }
    }

    schedule.push(round)
  }

  return schedule
}

// Exemplo de uso
const players = [
  'Bruno',
  'Tiago',
  'João',
  'Pedro',
  'Lucas',
  'Rafael',
  'Gabriel',
  'Matheus'
]
const schedule = generateSchedule(players)

console.log('Tabela de Jogos:')
schedule.forEach((round, index) => {
  console.log(`Rodada ${index + 1}:`)

  round.forEach((pair) => {
    console.log(`${pair[0]} x ${pair[1]}`)
  })
  console.log('---')
})
