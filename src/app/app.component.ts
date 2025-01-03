import { Component, importProvidersFrom, NgModule } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
} from '@angular/common/http';
import { MenubarModule } from 'primeng/menubar';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from './app.state';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { selectUser } from './store/selectors/auth.selectors';
import { getUser } from './store/actions/auth.actions';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { InfoService } from './api/info.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenubarModule,
    ButtonModule,
    TableModule,
    OverlayPanelModule,
    // FileUploadModule,
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'InfoHubFrontEnd';
  // logOut()  {
  //   localStorage.removeItem('access_token');
  //   this.router.navigateByUrl('/login');
  // };
  items: any[] = [
    {
      label: 'Accueil',
      icon: 'pi pi-home',
      command: () => this.router.navigate(['/home']),
    },

    {
      label: 'Ajouter Info',
      icon: 'pi pi-plus',
      visible: false,
      command: () => this.router.navigate(['/info/add']),
    },
    {
      label: 'Ajouter categorie',
      icon: 'pi pi-plus',
      visible: false,
      command: () => this.router.navigate(['/category']),
    },
    {
      label: 'Déconnexion',
      icon: 'pi pi-sign-out',
      command: () => {
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('/login');
      },
    },
  ];
  user: any;
  constructor(
    private router: Router,
    public translate: TranslateService,
    public messageService: MessageService,
    public store: Store,
    public infoService: InfoService
  ) {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    localStorage.setItem('lang', 'en');
    const browserLang = translate.getBrowserLang();
    this.store.dispatch(getUser());
    this.store.select(selectUser).subscribe((val) => {
      this.user = val.user;
      this.items = [
        {
          label: 'Accueil',
          icon: 'pi pi-home',
          command: () => this.router.navigate(['/home']),
        },

        {
          label: 'Ajouter Info',
          icon: 'pi pi-plus',
          visible: this.user?.role?.id == 1,
          command: () => this.router.navigate(['/info/add']),
        },
        {
          label: 'Ajouter categorie',
          icon: 'pi pi-plus',
          visible: this.user?.role?.id == 1,
          command: () => this.router.navigate(['/category']),
        },
        {
          label: 'Déconnexion',
          icon: 'pi pi-sign-out',
          command: () => {
            localStorage.removeItem('access_token');
            this.router.navigateByUrl('/login');
          },
        },
      ];
    });
    translate.use(browserLang && browserLang.match('en') ? browserLang : 'en');
  }

  showInfo(id: any) {
    this.router.navigate(['/info/' + id]);
  }
  saveInfo(id: any) {
    this.infoService.toggleInfo(id, this.user?.id).subscribe((val: any) => {
      this.store.dispatch(getUser());

      this.messageService.add({
        severity: 'success',
        summary: val.message,
        detail: '',
      });
    });
  }
}
