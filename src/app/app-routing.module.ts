import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackerComponent } from './components/tracker/tracker.component';
import { ResultsComponent } from './components/results/results.component';

const routes: Routes = [
  { path: '', component: TrackerComponent },
  { path: 'tracker', component: TrackerComponent },
  { path: 'results/:teamId', component: ResultsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
