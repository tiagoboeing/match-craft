import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { shuffle } from 'lodash'
import { Subject, takeUntil } from 'rxjs'
import { Player } from './models/player.model'
import { PlayerService } from './services/player.service'

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>()

  form!: FormGroup
  players: Player[] = []

  constructor(
    private playerService: PlayerService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
  ) {
    this.form = this.formBuilder.group<{ name: FormControl<string> }>({
      name: this.formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    })
  }

  ngOnInit(): void {
    this.handleListChanges()
  }

  ngOnDestroy(): void {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

  handleListChanges(): void {
    this.playerService.listChanged
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((players) => (this.players = players))
  }

  create(): void {
    const playerName = this.form.get('name')?.value

    this.playerService.create(playerName)
    this.form.reset()
  }

  remove(id: number): void {
    this.playerService.remove(id)
  }

  randomizePlayers(): void {
    this.players = shuffle(this.players)
  }

  get addMoreText(): string | void {
    if (this.playersLengthIsRight && this.players.length) return

    const quantity = this.players.length
    const nextMultiple = Math.floor(quantity / 4) * 4 + 4
    const playersRemainingToRelease = nextMultiple - quantity

    return this.translate.instant('player.buttons.add-more-players', {
      number: playersRemainingToRelease,
    })
  }

  get playersLengthIsRight(): boolean {
    return this.players.length % 4 === 0
  }
}
