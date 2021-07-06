import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { ItemComponent } from './item/item.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
    { path: 'things', component: ListComponent },
    { path: 'news-sources', component: ListComponent },
    { path: 'things/:id', component: ItemComponent },
    { path: 'news-source/:id', component: ItemComponent },
    { path: '',   redirectTo: '/things', pathMatch: 'full' }
  ];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }