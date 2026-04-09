import { Injectable, signal } from "@angular/core";
import { ILoginResponse } from "../../core/interfaces/auth.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthStoreService {
    private jwtAccessTokenKey = 'access_token';
    private jwtRefreshTokenKey = 'refresh_token';

    private readonly loggedIn = signal<boolean>(false);


    isLoggedIn(): boolean {
        return this.loggedIn();
    }

    setIsLoggedIn(value: boolean): void {
        this.loggedIn.set(value);
    }

    storeTokens(response: ILoginResponse): void {
        localStorage.setItem(this.jwtAccessTokenKey, response.token);
        localStorage.setItem(this.jwtRefreshTokenKey, response.refreshToken);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.jwtAccessTokenKey);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.jwtRefreshTokenKey);
    }

    removeTokens(): void {
        localStorage.removeItem(this.jwtAccessTokenKey);
        localStorage.removeItem(this.jwtRefreshTokenKey);
    }

}