import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: "laola-search",
    templateUrl: 'laola-search.component.html',
    styleUrls: ['laola-search.component.scss']
})
export class LaolaSearchComponent implements OnInit {

    @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

    public searchTerm: string;  

    public searchForm = this.formBuilder.group({
        searchInput: ['']
      });

    constructor(
        private formBuilder: FormBuilder,
    ) {
        this.searchTerm = '';
    }

    ngOnInit(): void {
    }

    triggerSearch() {
        this.onSearch.emit(this.searchForm.get('searchInput')?.value as string);
    }
    

    ngOnDestroy(): void {
    }
}
