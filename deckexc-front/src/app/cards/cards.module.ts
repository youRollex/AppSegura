import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsRoutingModule } from './cards-routing.module';
import { CardComponent } from './components/card/card.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { CardPageComponent } from './pages/card-page/card-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyListComponent } from './pages/my-list/my-list.component';
import { MyCardComponent } from './components/my-card/my-card.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { ChatModule } from '../chat/chat.module';

@NgModule({
  declarations: [
    CardComponent,
    LayoutPageComponent,
    CardPageComponent,
    ListPageComponent,
    NewPageComponent,
    MyListComponent,
    MyCardComponent,
    ConfirmDialogComponent,
    EditPageComponent
  ],
  imports: [
    CommonModule,
    CardsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    ChatModule
  ]
})
export class CardsModule { }
