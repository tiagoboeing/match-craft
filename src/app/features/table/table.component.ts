import { Component, Input } from '@angular/core'
import { Player } from '../player/models/player.model'
import { Match, Round } from './models/table.model'
import { TableService } from './services/table.service'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input()
  players: Player[] = []

  matches: Match[] = []
  rounds: Round[] = []
  stats!: ReturnType<typeof this.tableService.calculate>

  constructor(private tableService: TableService) {}

  public create(players: Player[]): void {
    this.matches = this.tableService.createMatches(players)

    this.stats = this.tableService.calculate(players)

    this.rounds = this.tableService.createRounds(
      this.matches,
      players,
      this.stats.totalRounds,
    )

    console.log(this.matches)
    console.log(this.stats)
    console.log(this.rounds)
  }

  print(): void {
    window.print()
  }

  exportPDF(): void {
    const matches = document.getElementById('matches')

    html2pdf()
      .from(matches)
      .set({
        margin: 10,
        image: { type: 'png', quality: 1.0 },
        jsPDF: {
          orientation: 'portrait',
          compress: true,
          pagesplit: true,
        },
        html2canvas: {
          scale: 2,
          scrollY: 0,
          letterRendering: true,
          ignoreElements: (element: any) =>
            element.id === 'print' || element.id === 'export-pdf',
        },
      })
      .toPdf()
      .save()
  }

  get websiteUrl(): string {
    return window.location.hostname
  }
}
