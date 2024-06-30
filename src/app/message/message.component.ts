import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgIf, MarkdownModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message!: {
    type: string,
    message: string
  }
  
}
