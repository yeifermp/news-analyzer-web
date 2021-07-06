import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityClient, EntityViewModel, ProviderClient } from '../entity.client';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
    entities: EntityViewModel[] = [];
    destroy$ = new Subject<void>();
    loading = false;
    isProvidersList = false;

    constructor(private entityClient: EntityClient,
        private activatedRoute: ActivatedRoute,
        private providerClient: ProviderClient) { }

    ngOnInit(): void {
        this.loading = true;

        if (this.activatedRoute.snapshot.url[0].path == 'things') {
            this.entityClient.entityAll().pipe(takeUntil(this.destroy$)).subscribe(list => this.loadList(list));
        } else {
            this.isProvidersList = true;
            this.providerClient.providerAll().pipe(takeUntil(this.destroy$)).subscribe(list => this.loadList(list));
        }
    }

    loadList(list: EntityViewModel[]): void {
        this.loading = false;

        if (list !== null && list.length > 0) {
            list.forEach(item => this.checkImages(item));
            this.entities = list;                        
        }
    }

    checkImages(item: EntityViewModel) {
        if (item.imageUrl === null || item.imageUrl === "")
            item.imageUrl = "https://cdn4.iconfinder.com/data/icons/core-ui-outlined/32/outlined_placeholder-512.png";        
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    showList(): boolean {
        return this.entities !== null && this.entities.length > 0;
    }
}
