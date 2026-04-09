import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthStoreService {
    private readonly loggedIn = signal<boolean>(false);


    isLoggedIn(): boolean {
        return this.loggedIn();
    }

    setIsLoggedIn(value: boolean) {
        this.loggedIn.set(value);
    }
    
}