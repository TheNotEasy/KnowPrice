import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss', 'github-markdown.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MarkdownComponent implements OnInit {
  @Input() markdown!: string

  constructor() { }

  ngOnInit() {
    this.markdown = marked.parse(this.markdown)
  }
}
