import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfoService } from '../../../api/info.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { environment } from '../../../../environments/environment.development';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';
import { getUser } from '../../../store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { selectUser } from '../../../store/selectors/auth.selectors';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-info-details',
  standalone: true,
  imports: [
    DatePipe,
    NgxDocViewerModule,
    TagModule,
    MessageModule,
    AccordionModule,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './info-details.component.html',
  styleUrl: './info-details.component.scss',
})
export class InfoDetailsComponent {
  info: any;
  fileUrl: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private infoService: InfoService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    public store: Store
  ) {}
  urlSafe: SafeResourceUrl | undefined;
  base_url = 'https://management-tool-backend.terrakodo.com';
  // base_url= environment.baseUrl;
  user: any;
  ngOnInit(): void {
    this.store.select(selectUser).subscribe((val) => {
      this.user = val.user;
    });
    const infoId = this.route.snapshot.paramMap.get('id');
    if (infoId) {
      this.infoService.getInfoById(+infoId).subscribe((data) => {
        this.info = data;
        this.fileUrl = this.getFileUrl(data.file.file_path);
      });
    }
    // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   'http://localhost/storage/files/VqzhWzHUOdTR5axPteST0CEt6LcJBy22ByIgXSCE.docx'
    // );
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://management-tool-backend.terrakodo.com/storage/file/VqzhWzHUOdTR5axPteST0CEt6LcJBy22ByIgXSCE.docx'
      // `https://view.officeapps.live.com/op/embed.aspx?src=http://localhost/storage/files/VqzhWzHUOdTR5axPteST0CEt6LcJBy22ByIgXSCE.docx`
      // 'http://localhost/storage/files/K3YDIEG04yzB5RExdC917wunC3AeNlV5qCy2TT3K.pdf'
    );
  }
  saveInfo(id: any) {
    this.infoService.toggleInfo(id, this.user?.id).subscribe((val: any) => {
      // this.loadInfos();
      this.store.dispatch(getUser());
      this.info.isSavedByUser = !this.info.isSavedByUser;
      this.messageService.add({
        severity: 'success',
        summary: val.message,
        detail: '',
      });
    });
  }
  // loadInfos() {}
  // Génère l'URL complète du fichier
  getFileUrl(filePath: string): string {
    return `http://localhost${filePath}`;
  }

  // Vérifie si le fichier est visualisable (PDF ou texte)
  isFileViewable(filePath: string): boolean {
    const viewableExtensions = ['.pdf', '.txt', '.docx'];
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    return viewableExtensions.includes(`.${fileExtension}`);
  }

  getSanitizedFile(file_path: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.getFileUrl(file_path)
    );
  }

  selectDocumentType(type: any) {
    switch (type) {
      case 'doc':
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://localhost/storage/files/K3YDIEG04yzB5RExdC917wunC3AeNlV5qCy2TT3K.pdf'
        );
        break;
      case 'xl':
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          'http://localhost/storage/files/VqzhWzHUOdTR5axPteST0CEt6LcJBy22ByIgXSCE.docx'
        );
        break;
      case 'ppt':
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          'http://localhost/storage/files/VqzhWzHUOdTR5axPteST0CEt6LcJBy22ByIgXSCE.docx'
        );
        break;
      default:
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          'http://localhost/storage/files/VqzhWzHUOdTR5axPteST0CEt6LcJBy22ByIgXSCE.docx'
        );
    }
  }
}
