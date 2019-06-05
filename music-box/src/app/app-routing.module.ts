import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailAlbumsComponent } from './components/detail-albums/detail-albums.component';
import { HotReleasesComponent } from './components/hot-releases/hot-releases.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { MaterialModule } from './shared/material-module';

const routes: Routes = [
  { path: "search-page", component: WrapperComponent },
  {
    path: "artist-detail-page/:id",
    component: DetailAlbumsComponent
  },
  { path: "settings-page", component: SettingsComponent },
  { path: "hot-releases", component: HotReleasesComponent },
  { path: "", redirectTo: "/search-page", pathMatch: "full" },
  { path: "**", component: WrapperComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" }),
    MaterialModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
