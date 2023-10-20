import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';
import { LaolaComponentsModule } from '../components/laola-components.module'

import {
    AlertModule,
    BadgeModule,
    ToastModule,
    TooltipModule,
    UtilitiesModule,
    AvatarModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    NavModule,
    ProgressModule,
    TableModule,
    TabsModule,
    PaginationModule,
    WidgetModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';

@NgModule({
    imports: [
    ],
    exports: [
        AlertModule,
        UtilitiesModule,
        BadgeModule,
        ToastModule,
        TooltipModule,
        CardModule,
        NavModule,
        IconModule,
        TabsModule,
        FormsModule,
        CommonModule,
        GridModule,
        ProgressModule,
        ReactiveFormsModule,
        ButtonModule,
        FormModule,
        ButtonModule,
        ButtonGroupModule,
        ChartjsModule,
        AvatarModule,
        TableModule,
        WidgetModule,
        TranslateModule,
        PipesModule,
        PaginationModule
    ]
})
export class SharedModule {
}
