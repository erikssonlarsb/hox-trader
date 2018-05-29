import { Component, OnInit } from '@angular/core';
import { HttpParams }  from '@angular/common/http';

import { ApiService } from '../../services/api/api.service';

import { User } from '../../models/index';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent  implements OnInit  {
  users: Array<User>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getUsers(new HttpParams().set('_populate', 'role'))
      .subscribe(
        users =>  this.users = users
      );
  }
}
