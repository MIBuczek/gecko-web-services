import {TestBed} from '@angular/core/testing';

import {LoaderService} from './loader.service';

describe('LoaderService', () => {
    let service: LoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('it should initial return false ', (done) => {
        service.loaderStatus.subscribe((status) => {
            expect(status).toBeFalsy()
            done()
        })
    });

    it('is return truthy status when changeLoadingStatus is called', (done) => {
        service.changeLoadingStatus = true
        service.loaderStatus.subscribe((status) => {
            expect(status).toBeTruthy()
            done()
        })
    })
});
