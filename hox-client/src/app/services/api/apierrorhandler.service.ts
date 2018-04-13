import { Injectable } from '@angular/core';
import { HttpErrorResponse }  from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class ApiErrorHandler {
  constructor(private authService: AuthService) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      if(error.status == 401) {
        // Access denied. Logout user to prompt re-login.
        this.authService.logout();
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`
        );
      }
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(error.error);
  };
}
