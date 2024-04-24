import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subscription } from "rxjs";

export type TypeContentId = 'start' | 'about' | 'service' | 'contact'

@Injectable({
    providedIn: 'root',
})
export class ScrollService implements OnDestroy {
    private currentSection = new BehaviorSubject<TypeContentId>('start');
    readonly sections: TypeContentId[] = ['start', 'about', 'service', 'contact']
    private subscription = new Subscription()

    constructor() {
        this.subscription.add(fromEvent(window, 'scroll').subscribe(() => this.keepTrack()))
    }

    get getCurrentActiveSection(): Observable<TypeContentId> {
        return this.currentSection.asObservable()
    }

    /* Method to track sections and set active the one on view */
    keepTrack() {
        this.sections.forEach((section): void => {
            const element = document.getElementById(section);
            if (!element) {
                return
            }
            const { top } = element.getBoundingClientRect();
            if (top >= 0 && top <= window.innerHeight / 2) {
                this.currentSection.next(section);
            }
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
