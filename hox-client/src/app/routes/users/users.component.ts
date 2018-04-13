import { Component, OnInit } from '@angular/core';

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
    this.apiService.getUsers()
      .subscribe(
        users =>  this.users = users
      );
  }
}
