import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CardsService } from '../../services/cards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OffersInterface } from '../../../interfaces/oferta.interface';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  public imagenRuta: string = 'assets/cards/';
  public offer!: OffersInterface
  public cardForm = new FormGroup({
    condition: new FormControl<string>(''),
    price: new FormControl<number>(1, [Validators.required, Validators.min(1), Validators.max(1000000)])
  });


  constructor(
    private cardSrv: CardsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  get currentCard(): OffersInterface {
    const card = this.cardForm.value as OffersInterface;
    return card;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) {
      return;
    }
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.cardSrv.getOfferById(id))
      ).subscribe(card => {
        if (!card) {
          return this.router.navigateByUrl('/');
        }
        this.offer = card
        this.imagenRuta = this.imagenRuta + this.offer.card.imageUrl

        this.cardForm.reset(card);
        return;
      })
  }

  // Para cuando se envie el formulario
  onSubmit(): void {
    if (this.cardForm.invalid) return;

    // Si tiene un id va a actualizar el registro
    if (this.offer.id) {
      this.cardSrv.updateOfferById(this.offer.id, this.currentCard.condition, this.currentCard.price)
        .subscribe(card => {
          this.router.navigate(['/cards'])
          this.showSnackbar(`${this.offer.card.name} actualizado!`);
        });
      return;
    }
    this.cardSrv.addOffer(this.offer.id, this.offer.description, this.currentCard.condition, this.currentCard.price)
      .subscribe(card => {
        this.router.navigate(['/cards/edit', card.id])
        this.showSnackbar(`${this.offer.card.name} creado!`)
      })
  }

  onDeleteHero() {
    if (!this.offer.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.cardForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.cardSrv.deleteOfferById(this.offer.id)),
        filter((wasDeleted: boolean) => wasDeleted),
      )
      .subscribe(result => {
        this.router.navigate(['/cards']);
      })

  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, '', {
      duration: 2500,
    })
  }
}
