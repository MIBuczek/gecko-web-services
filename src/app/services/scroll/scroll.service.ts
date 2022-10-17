import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export type TypeContentId = 'start' | 'about' | 'service' | 'contact'

@Injectable({
    providedIn: 'root',
})
export class ScrollService {
    private currentSection = new BehaviorSubject<TypeContentId>('start');
    readonly sections: TypeContentId[] = ['start', 'about', 'service', 'contact']

    constructor() {
        document.addEventListener('scroll', () => this.keepTrack())
    }

    get getCurrentActiveSection(): Observable<TypeContentId> {
        return this.currentSection.asObservable()
    }

    /* Method to track sections and set active which is currently on view */
    keepTrack() {
        const viewHeight = window.innerHeight;
        this.sections.forEach((section) => {
            const element = document.getElementById(section);
            if (!element) {
                return
            }
            const {top} = element.getBoundingClientRect();
            if (top >= 0 && top < viewHeight / 2) {
                this.currentSection.next(section);
            }
        })
    }
}
