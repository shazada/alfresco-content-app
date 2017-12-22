import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-code-preview',
    template: `
        <adf-code-viewer
            [language]="language"
            [readOnly]="true"
            [value]="content">
        </adf-code-viewer>
    `,
    styles: [`
        .adf-code-viewer {
            height: 100vh;
        }
        .adf-code-viewer > .monaco-editor {
            height: 100vh;
        }
    `]
})
export class CodePreviewComponent implements OnInit {

    private _extension = 'text';

    private langs = {
        'xml': 'xml',
        'txt': 'text',
        'ts': 'typescript',
        'java': 'java',
        'js': 'javascript',
        'ftl': 'html',
        'html': 'html'
    }

    @Input()
    language = 'text';

    @Input()
    url = '';

    @Input()
    set extension(value: string) {
        this._extension = value;
        this.language = this.langs[value] || 'text';
        console.log(this._extension, this.language);
    }

    get extension(): string {
        return this._extension;
    }

    content = '';

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        if (this.url) {
            this.http
                .get(this.url, { responseType: 'text' })
                .subscribe(text => {
                    this.content = text || '';
                });
        }
    }

}
