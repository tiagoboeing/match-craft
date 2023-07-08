import { Match, Player, Round } from './models/interfaces.model'

function createPlayers(...players: string[]): Player[] {
  return players.map((name, index) => ({
    id: index + 1,
    name,
    hasPlayedWith: new Set(),
  }))
}

function calculate(players: Player[], playersPerTeam = 2) {
  const totalPlayers = players.length
  const matchesPerRound = Math.round(totalPlayers / (playersPerTeam * 2))
  const matchesPerPlayer = totalPlayers - 1
  const totalRounds = matchesPerPlayer
  const totalMatches = matchesPerRound * (totalPlayers - 1)

  console.table({
    totalMatches,
    totalRounds,
    totalPlayers,
    matchesPerRound,
    matchesPerPlayer,
  })

  return {
    totalMatches,
    totalRounds,
    totalPlayers,
    matchesPerRound,
    matchesPerPlayer,
  }
}

function createMatches(players: Player[]): Match[] {
  const matches: Match[] = []
  const usedTeams: Set<string> = new Set()

  if (players.length % 2 !== 0) {
    throw new Error('The number of participants must be even')
  } else if (players.length < 2) {
    throw new Error('The number of participants must be greater than 1')
  }

  generateMatches([], players)

  function generateMatches(
    selectedPlayers: Player[],
    remainingPlayers: Player[],
  ) {
    if (selectedPlayers.length === 4) {
      const team1 = [selectedPlayers[0], selectedPlayers[1]]
      const team2 = [selectedPlayers[2], selectedPlayers[3]]

      if (isValidMatch(team1, team2)) {
        const team1Key = getTeamKey(team1)
        const team2Key = getTeamKey(team2)

        if (!usedTeams.has(team1Key) && !usedTeams.has(team2Key)) {
          usedTeams.add(team1Key)
          usedTeams.add(team2Key)

          const match: Match = {
            team1: team1,
            team2: team2,
          }

          matches.push(match)
        }
      }
    } else {
      for (let i = 0; i < remainingPlayers.length; i++) {
        const player = remainingPlayers[i]

        if (isValidPlayer(selectedPlayers, player)) {
          generateMatches(
            [...selectedPlayers, player],
            remainingPlayers.filter((_, index) => index !== i),
          )
        }
      }
    }
  }

  function isValidPlayer(selectedPlayers: Player[], player: Player): boolean {
    for (const selectedPlayer of selectedPlayers) {
      if (selectedPlayer.hasPlayedWith.has(player.name)) {
        return false
      }
    }
    return true
  }

  function isValidMatch(team1: Player[], team2: Player[]): boolean {
    for (const player of team1) {
      if (
        player.hasPlayedWith.has(team2[0].name) ||
        player.hasPlayedWith.has(team2[1].name)
      ) {
        return false
      }
    }

    for (const player of team2) {
      if (
        player.hasPlayedWith.has(team1[0].name) ||
        player.hasPlayedWith.has(team1[1].name)
      ) {
        return false
      }
    }

    return true
  }

  function getTeamKey(team: Player[]): string {
    const [player1, player2] = team
    return [player1.name, player2.name].sort().join('-')
  }

  return matches
}

function createRounds(
  matches: Match[],
  players: Player[],
  totalRounds: number,
) {
  let playersNotPlayOnRound = structuredClone(players)
  let roundMatches: Round[] = []

  for (let round = 1; round <= totalRounds; round++) {
    while (playersNotPlayOnRound.length > 0) {
console.log('createRounds');

      const player =
        playersNotPlayOnRound[
          Math.round(Math.random() * (playersNotPlayOnRound.length - 1))
        ]

      // find a team with the sorted player
      const playerMatches = matches.filter(
        ({ team1, team2 }) =>
          team1.some((p) => p.id === player.id) ||
          team2.some((p) => p.id === player.id),
      )

      const matchWithPlayersAvailables = playerMatches.find((match) => {
        const { team1, team2 } = match

        // check if all players from match not played yet on the round
        const allTeam1PlayersAreAvailable = team1.every((p) =>
          playersNotPlayOnRound.find((player) => player.id === p.id),
        )
        const allTeam2PlayersAreAvailable = team2.every((p) =>
          playersNotPlayOnRound.find((player) => player.id === p.id),
        )

        return allTeam1PlayersAreAvailable && allTeam2PlayersAreAvailable
      })

      if (!playerMatches || !matchWithPlayersAvailables) {
        continue
      }

      const { team1, team2 } = matchWithPlayersAvailables

      // remove players from list
      playersNotPlayOnRound = playersNotPlayOnRound.filter(
        (player) =>
          player.id !== team1[0].id &&
          player.id !== team1[1].id &&
          player.id !== team2[0].id &&
          player.id !== team2[1].id,
      )

      roundMatches.push({
        round,
        matches: [matchWithPlayersAvailables],
      })
    }

    playersNotPlayOnRound = structuredClone(players)
  }

  return roundMatches
}

// Exemplo de utilização:
const players = createPlayers(
  'Tiago',
  'Bruno',
  'Rafael',
  'Pedro',
  'João',
  'Lucas',
  // 'Matheus',
  // 'Marcos',
)

const matches = createMatches(players)
const { totalRounds } = calculate(players, 2)

matches.forEach((match, index) => {
  console.log(`Partida ${index + 1}:`)

  const { team1, team2 } = match
  const [team1Player1, team1Player2] = team1
  const [team2Player1, team2Player2] = team2

  console.log(
    `${team1Player1.name} (${team1Player1.id}) / ${team1Player2.name} (${team1Player2.id}) x ${team2Player1.name} (${team2Player1.id}) / ${team2Player2.name} (${team2Player2.id})`,
  )

  console.log('')
})

const rounds = createRounds(matches, players, totalRounds)

function groupRounds(rounds: Round[]) {
  return rounds.reduce((acc, round) => {
    const { round: roundNumber, matches } = round

    if (!acc[roundNumber]) {
      acc[roundNumber] = {
        round: roundNumber,
        matches: [],
      }
    }

    acc[roundNumber].matches.push(...matches)

    return acc
  }, {} as Round[])
}

for (const currentRound of rounds) {
  console.log(`Rodada ${currentRound.round}:`)

  for (const match of currentRound.matches) {
    console.log(
      `${match.team1.map((p) => p.name).join(' / ')} x ${match.team2
        .map((p) => p.name)
        .join(' / ')}`,
    )
  }
}
