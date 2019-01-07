import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DesignComponent } from './design/design.component';
import { PhotographyComponent } from './photography/photography.component';

const routes: Routes = [
    { path: '', component: HomeComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        HomeComponent,
        DesignComponent,
        PhotographyComponent
    ],
    entryComponents: [
        DesignComponent,
        PhotographyComponent
    ]
})
export class DesktopModule { }
