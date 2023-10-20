import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: "laola-pagination",
    templateUrl: 'laola-pagination.component.html',
    styleUrls: ['laola-pagination.component.scss']
})
export class LaolaPaginationComponent implements OnInit {
    
    @Input()
    items$!: BehaviorSubject<any[]>; 

    @Input() itemsPerPage: number = 10; ;
    @Input() initialPage: number = 1; 

    @Output() changePage: EventEmitter<any[]> = new EventEmitter<any[]>();

    public currentPage: number = this.initialPage; 
    public currentPageItems: any[] = [];
    public previousDisabled: boolean = true; 
    public nextDisabled: boolean = false; 
    public maxPages: number;

    private items: any[] = [];

    private subscriptions: Subscription[];


    constructor(
    ) {
        this.subscriptions = [];
        this.maxPages = 0; 
    }

    ngOnInit(): void {
        const subscription = this.items$.subscribe((items) => {
            this.items = items;
            this.maxPages = Math.ceil(this.items?.length / this.itemsPerPage);
            this.setPage(this.initialPage);
        });

        this.subscriptions.push(subscription);

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    toggleButtonStates() {
        this.previousDisabled = false;
        this.nextDisabled = false;
        if(this.currentPage <= 1) this.previousDisabled = true; 
        if(this.currentPage >= this.maxPages) this.nextDisabled = true; 
    }


    setPage(page: number) {
        this.currentPage = page; 
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.currentPageItems = this.items?.slice(startIndex, endIndex) || [];
        
        this.changePage.emit(this.currentPageItems);
        this.toggleButtonStates();
    }


    previous() {
        if(this.currentPage !== 1) {
            this.setPage(this.currentPage - 1);
        }
    }

    next() {
        if(this.currentPage !== this.maxPages) {
            this.setPage(this.currentPage + 1);
        }
    }
}
