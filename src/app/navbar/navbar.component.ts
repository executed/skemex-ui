import {Component, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private appService: AppService,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.getMigrationConflictsCount();
  }

  public getMigrationConflictsCount() {
    if (this.authService.isAuthenticated()) {
      this.appService.getMigrationConflictsCount(this.authService.getCurrentUser().nickname).subscribe(
        data => {
          console.log(data)
          this.appService.navConflictsCount = data.data;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  redirectToSearch() {
      this.router.navigate(['./search/']);
    }
}
