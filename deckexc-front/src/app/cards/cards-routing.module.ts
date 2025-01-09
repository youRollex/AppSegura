import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { CardPageComponent } from './pages/card-page/card-page.component';
import { MyListComponent } from './pages/my-list/my-list.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'new-card', component: NewPageComponent },
      { path: 'edit/:id', component: EditPageComponent },
      { path: 'list', component: ListPageComponent },
      { path: 'my-list', component: MyListComponent },
      { path: ':id', component: CardPageComponent },
      { path: '**', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsRoutingModule { }
