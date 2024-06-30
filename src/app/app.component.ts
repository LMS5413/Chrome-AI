import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Injectable,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { chromeai } from 'chrome-ai';
import { generateText, streamText } from 'ai';
import { MessageComponent } from './message/message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    InputTextareaModule,
    NgIf,
    ButtonModule,
    NgFor,
    MessageComponent,
    CardModule,
  ],
})
@Injectable()
export class AppComponent implements OnInit {
  title = 'ChromeAI';
  a = 1;
  history: {
    type: string;
    message: string;
  }[] = [];

  private model = chromeai('generic', {
    topK: 5,
    temperature: 0.5,
  });

  isSupport = false;
  isModalNotSupport = false;
  inAnswing = false;
  private session: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.isSupport = await this.checkBrowser();
      this.isModalNotSupport = !this.isSupport;
      if (this.isSupport) {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            this.sendMessage();
          }
        });
        this.session = await (window as any).ai.createTextSession();
      }
    }
  }

  sendMessage() {
    let text = (document.querySelector('#message') as HTMLInputElement).value;

    if (!text) {
      return;
    }
    this.history.push({
      type: 'user',
      message: text,
    });

    this.history.push({
      type: 'ai',
      message: '',
    });
    this.resetText();
    this.getResponse(text);
  }

  resetText() {
    const element = document.querySelector('#message') as HTMLInputElement;
    if (element) {
      element.value = '';
    }
  }

  clearMessage() {
    this.history = [];
  }

  async checkBrowser() {
    try {
      await generateText({
        model: chromeai(),
        prompt: '',
      });
      return true;
    } catch (e: any) {
      console.log('Real Error:', e.message);
      if (e.message === 'Browser not support') {
        return false;
      }
      return true;
    }
  }

  private async getResponse(text: string) {
    const object = this.history[this.history.length - 1];
    try {
      this.inAnswing = true;
      const stream = this.session.promptStreaming(text);
      for await (const response of stream) {
        object.message = response.replace('```c#', '```csharp');
      }
      this.inAnswing = false;
    } catch (e) {
      object.message = 'An error occurred while processing the request. See the console for more information.';
      console.error(e);
      this.inAnswing = false;
    }
  }
}
