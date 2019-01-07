import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: 'home', loadChildren: './pages/desktop/desktop.module#DesktopModule' },
    { path: '', loadChildren: './pages/mobile/mobile.module#MobileModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
