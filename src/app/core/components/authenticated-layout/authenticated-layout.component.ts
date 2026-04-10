import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStoreService } from '../../../services/auth/auth-store.service';

@Component({
  selector: 'app-authenticated-layout',
  imports: [RouterModule],
  templateUrl: './authenticated-layout.component.html',
  styleUrl: './authenticated-layout.component.scss'
})
export class AuthenticatedLayoutComponent {

  private readonly authStoreService = inject(AuthStoreService);

  logout(): void {
    this.authStoreService.logout();
  }

}
