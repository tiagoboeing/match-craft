import { Injectable } from '@angular/core'
import { Player } from '../../player/models/player.model'
import { Match, Round } from '../models/table.model'

@Injectable()
export class TableService {
  constructor() {}

  calculate(players: Player[], playersPerTeam = 2) {
    const totalPlayers = players.length
    const matchesPerRound = Math.round(totalPlayers / (playersPerTeam * 2))
    const matchesPerPlayer = totalPlayers - 1
    const totalRounds = matchesPerPlayer
    const totalMatches = matchesPerRound * (totalPlayers - 1)

    return {
      totalMatches,
      totalRounds,
      totalPlayers,
      matchesPerRound,
      matchesPerPlayer,
    }
  }

  createMatches(players: Player[]): Match[] {
    const matches: Match[] = []
    const usedTeams: Set<string> = new Set()

    if (players.length % 4 !== 0) {
      throw new Error('The number of participants must be even and divisible by 4')
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
      return [player1.id, player2.id].sort().join('-')
    }

    return matches
  }

  createRounds(matches: Match[], players: Player[], totalRounds: number) {
    let playersNotPlayOnRound = structuredClone(players)
    let roundMatches: Round[] = []
    const clonedMatches = structuredClone(matches)

    for (let round = 1; round <= totalRounds; round++) {
      while (playersNotPlayOnRound.length > 0) {
        const player =
          playersNotPlayOnRound[
            Math.round(Math.random() * (playersNotPlayOnRound.length - 1))
          ]

        // find a team with the sorted player
        const playerMatches = clonedMatches.filter(
          ({ team1, team2 }) =>
            team1.some((p) => p.id === player.id) ||
            team2.some((p) => p.id === player.id),
        )

        // find a match with all players availables
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

        // add match to round
        roundMatches.push({
          round,
          matches: [matchWithPlayersAvailables],
        })

        // mark match as played removing from list
        clonedMatches.splice(clonedMatches.indexOf(matchWithPlayersAvailables), 1)
      }

      playersNotPlayOnRound = structuredClone(players)
    }

    return roundMatches
  }

  groupRounds(rounds: Round[]) {
    return rounds.reduce((acc: Round[], round) => {
      const { round: roundNumber, matches } = round

      const roundExists = acc?.find((r) => r.round === roundNumber)

      if (!roundExists) {
        acc.push({
          round: roundNumber,
          matches,
        })
      } else {
        roundExists?.matches.push(...matches)
      }

      return acc
    }, [] as Round[])
  }
}
