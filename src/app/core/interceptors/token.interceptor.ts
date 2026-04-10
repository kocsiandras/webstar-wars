import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthStoreService } from "../../services/auth/auth-store.service";
import { APPLICANT_ID } from "../../shared/constants/app.constants";


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authStoreService = inject(AuthStoreService);

    let request = req.clone({
        setHeaders: { 'Applicant-Id': APPLICANT_ID }
    })

    const token = authStoreService.getAccessToken();

    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    return next(request);
}