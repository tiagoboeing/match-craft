import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from './services/player.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Player } from './models/player.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  form!: FormGroup;
  players: Player[] = [];

  constructor(
    private playerService: PlayerService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group<{ name: FormControl<string> }>({
      name: this.formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.handleListChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleListChanges(): void {
    this.playerService.listChanged
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((players) => (this.players = players));
  }

  create(): void {
    const playerName = this.form.get('name')?.value;

    this.playerService.create(playerName);
    this.form.reset();
  }

  remove(id: number): void {
    this.playerService.remove(id);
  }
}
