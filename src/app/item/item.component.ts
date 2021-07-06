import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DetailedEntityViewModel, EntityClient, NewsClient, NewsViewModel, ProviderClient } from "../entity.client";

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, OnDestroy {
    loading = false;
    loadingPositiveRate = false;
    loadingNegativeRate = false;
    loadingNeutralRate = false;
    destroy$ = new Subject<void>();
    id: string = '';
    item = new DetailedEntityViewModel();
    news = new Array<NewsViewModel>();
    positive: number = 0;
    negative: number = 0;
    neutral: number = 0;
    
    constructor(private entityClient: EntityClient, 
        private route: ActivatedRoute, 
        private newsClient: NewsClient,
        private providerClient: ProviderClient) {
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnInit(): void {
        this.loading = true;
        this.loadingNegativeRate = true;
        this.loadingNeutralRate = true;
        this.loadingPositiveRate = true;

        this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.id = params["id"];
            if(this.route.snapshot.url[0].path === "things") {
                this.entityClient.entity(this.id).pipe(takeUntil(this.destroy$)).subscribe(entity => {
                    this.checkImages(entity);
                    this.item = entity;
                    this.loading = false;
                });
    
                this.newsClient.newsAll(this.id).pipe(takeUntil(this.destroy$)).subscribe(news => {
                    this.news = news;
                });
    
                this.newsClient.positive(this.id).pipe(takeUntil(this.destroy$)).subscribe(value => {
                    this.positive = Math.round(value); 
                    this.loadingPositiveRate = false;
                });
    
                this.newsClient.negative(this.id).pipe(takeUntil(this.destroy$)).subscribe(value => {
                    this.negative = Math.round(value); 
                    this.loadingNegativeRate = false;
                });
    
                this.newsClient.neutral(this.id).pipe(takeUntil(this.destroy$)).subscribe(value => { 
                    this.neutral = Math.round(value); 
                    this.loadingNeutralRate = false; 
                });
            } else {
                this.providerClient.provider(this.id).pipe(takeUntil(this.destroy$)).subscribe(entity => {
                    this.checkImages(entity);
                    this.item = entity;
                    this.loading = false;
                });
    
                this.newsClient.news(this.id).pipe(takeUntil(this.destroy$)).subscribe(news => {
                    this.news = news;
                });
            }            
        });
    }

    hasAboutItems(news: NewsViewModel): boolean {
        return news.isAbout !== null && news.isAbout !== undefined && news.isAbout.length > 0;
    }

    hasKeyPhrasesItems(news: NewsViewModel): boolean {
        return news.keyPhrases !== null && news.keyPhrases !== undefined && news.keyPhrases.length > 0;
    }

    checkImages(item: DetailedEntityViewModel) {
        if (item.imageUrl === null || item.imageUrl === "")
                item.imageUrl = "https://cdn4.iconfinder.com/data/icons/core-ui-outlined/32/outlined_placeholder-512.png"
        }
}