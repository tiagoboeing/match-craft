import { Match, Player, Team } from './models/interfaces.model'

function createPairs(players: Player[]): [Player, Player][] {
  const pairs: [Player, Player][] = []
  const availablePlayers = [...players]

  while (availablePlayers.length > 1) {
    const playerA = availablePlayers.shift()!
    const playerB = findCompatiblePlayer(playerA, availablePlayers)

    if (!playerB) {
      // Não há mais jogadores compatíveis, reiniciar o sorteio
      availablePlayers.push(playerA)
      availablePlayers.sort(() => Math.random() - 0.5)
    } else {
      pairs.push([playerA, playerB])
      playerA.hasPlayedWith.push(playerB)
      playerB.hasPlayedWith.push(playerA)
    }
  }

  return pairs
}

function findCompatiblePlayer(
  player: Player,
  availablePlayers: Player[],
): Player | undefined {
  const compatiblePlayers = availablePlayers.filter(
    (p) => !player.hasPlayedWith.includes(p) && p !== player,
  )

  if (compatiblePlayers.length === 0) {
    return undefined
  }

  return compatiblePlayers[Math.floor(Math.random() * compatiblePlayers.length)]
}

function generateMatches(players: Player[], playersPerTeam = 2) {
  const table: {
    round: number
    matches: Match[]
  }[] = []

  const totalPlayers = players.length
  const matchesPerRound = totalPlayers / (playersPerTeam * 2)
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

  if (totalPlayers % 2 !== 0) {
    throw new Error('The number of participants must be even')
  } else if (totalPlayers < 2) {
    throw new Error('The number of participants must be greater than 1')
  }

  const playTogether: Team[] = []
  const hasPlayerTogether = (player: Player, partner: Player) => {
    return playTogether.some(
      (team) =>
        (team.player1.id === player.id && team.player2.id === partner.id) ||
        (team.player1.id === partner.id && team.player2.id === player.id),
    )
  }

  const addToPlayerTogether = (player: Player, partner: Player) => {
    playTogether.push({
      player1: player,
      player2: partner,
    })
  }

  for (let round = 1; round <= totalRounds; round++) {
    console.log(`Round ${round}`)
    console.log('----------------------')

    const roundMatches: Match[] = []
    let playersAlreadyPlayOnRound: Player[] = []
    let playersRemainingToPlayOnRound: Player[] = players.slice()

    for (let match = 1; match <= matchesPerRound; match++) {
      console.log(`Match ${match}`)

      console.dir(createPairs(players))

      // while (playersRemainingToPlayOnRound.length > 0) {
      //   const player = playersRemainingToPlayOnRound[0]
      //   const sortedPartner =
      //     playersRemainingToPlayOnRound.slice(1)[
      //       Math.floor(Math.random() * (playersRemainingToPlayOnRound.length - 1))
      //     ]

      //   if (hasPlayerTogether(player, sortedPartner)) {
      //     console.warn(
      //       `"${player.name}" and "${sortedPartner.name}" Already played together`
      //     )
      //     continue
      //   } else {
      //     const team1: Team = {
      //       player1: player,
      //       player2: sortedPartner
      //     }

      //     addToPlayerTogether(player, sortedPartner)

      //     console.log('player', player)
      //     console.log('partner', sortedPartner)

      //     playersRemainingToPlayOnRound = playersRemainingToPlayOnRound.filter(
      //       (player) => player.id !== player.id && player.id !== sortedPartner.id
      //     )

      //     playersAlreadyPlayOnRound.push(player)
      //     playersAlreadyPlayOnRound.push(sortedPartner)
      //   }

      //   // roundMatches.push({ team1, team2 })
      // }
    }

    console.log('')
    table.push({ round: round, matches: roundMatches })
  }

  return table
}

// Exemplo de uso
const table = generateMatches([
  { id: 1, name: 'Tiago', hasPlayedWith: new Set() },
  { id: 2, name: 'Bruno', hasPlayedWith: new Set() },
  { id: 3, name: 'Rafael', hasPlayedWith: new Set() },
  { id: 4, name: 'Pedro', hasPlayedWith: new Set() },
  { id: 5, name: 'João', hasPlayedWith: new Set() },
  { id: 6, name: 'Lucas', hasPlayedWith: new Set() },
  { id: 7, name: 'Matheus', hasPlayedWith: new Set() },
  { id: 8, name: 'Marcos', hasPlayedWith: new Set() },
])!

// console.dir({ matches: table }, { depth: null })

// for (const rounds of table) {
//   console.log(`Round ${rounds.round}`)
//   console.log('----------------------')

//   for (const match of rounds.matches) {
//     console.log(
//       `${match.team1.player1.name} e ${match.team1.player2.name} vs ${match.team2.player1.name} e ${match.team2.player2.name}`
//     )
//   }

//   console.log('')
// }
