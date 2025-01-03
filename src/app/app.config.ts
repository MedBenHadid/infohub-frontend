import { environment } from './../environments/environment';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AuthGuard } from './auth.guard';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { MenubarModule } from 'primeng/menubar';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './store/reducer/auth.reducer';
import { AuthEffects } from './store/effects/auth.effects';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TokenInterceptor, tokenInterceptor } from './api/token.interceptor';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const translateModule = TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(MessageService),
    importProvidersFrom(BrowserAnimationsModule),
    InputTextModule,
    provideRouter(routes),
    provideStore(),

    provideState({ name: 'auth', reducer: authReducer }),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: true, // Restrict extension to log-only mode
    }),
    TranslateService,
    ...(translateModule.providers || []),

    provideEffects([AuthEffects]),
    provideStoreDevtools({
      connectInZone: true,
    }),
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    MenubarModule,
  ],
};


