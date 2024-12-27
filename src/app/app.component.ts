import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Injectable,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { MessageComponent } from './message/message.component';
import { AIService } from '../services/AIService';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    TextareaModule,
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
  history: {
    type: string;
    message: string;
  }[] = [];

  isModalNotSupport = false;
  isAnswer = false;
  isSessionCreated = false;
  tokensPerSecond = 0;
  tokens = 0;

  private preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        }
    }
  });

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private aiService: AIService,
    private primeng: PrimeNG
  ) {
    this.primeng.theme.set({
      preset: this.preset,
      options: {
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
        },
        darkModeSelector: false
      },
    });
  }

  async ngOnInit(): Promise<void> {
    this.primeng.ripple.set(true);
    if (isPlatformBrowser(this.platformId)) {
      if (!this.aiService.checkBrowser()) {
        this.isModalNotSupport = true;
        return;
      }

      this.history.push({
        type: "system",
        message: "You are a friendly AI. Your function is to help users with their questions. You can answer questions about programming, math, science, and more. This array sent is your history of messages. You can use this to keep track of the conversation.",
      });

      console.log('Creating session');
      await this.aiService.createSession();
      this.isSessionCreated = true;
    }
  }

  sendMessage() {
    let text = (document.querySelector('#message') as HTMLInputElement).value;

    if (!text) {
      return;
    }
    this.resetText();
    this.history.push({ type: 'user', message: text });
    this.getResponse(`HISTORY:${JSON.stringify(this.history)}\n\n:PROMPT ${text}`);
  }

  resetText() {
    const element = document.querySelector('#message') as HTMLInputElement;
    if (element) {
      element.value = '';
    }
  }

  clearMessage() {
    this.history = [this.history.find((item) => item.type !== 'system')!!];
  }

  private async getResponse(text: string) {
    this.history.push({ type: 'ai', message: '' });
    const object = this.history[this.history.length - 1];
    
    let startTime = Date.now(); // Tempo de início da requisição
    let tokenCount = 0; // Contador de tokens
    let lastTime = startTime; // Marca o último tempo para calcular os tokens por segundo em intervalos
    
    try {
      this.isAnswer = true;
      const stream = await this.aiService.prompt(text);
  
      for await (const response of stream) {
        object.message += response.replace('```c#', '```csharp');
        
        let tokensInCurrentResponse = response.split(/\s+/).length;
        tokenCount += tokensInCurrentResponse;
  
        let currentTime = Date.now();
        let elapsedTime = (currentTime - lastTime) / 1000;
  
        if (elapsedTime > 0) {
          let tokensPerSecond = tokensInCurrentResponse / elapsedTime;
          this.tokensPerSecond = Math.round(tokensPerSecond);
          this.tokens = tokenCount;
        }
  
        lastTime = currentTime;
      }
  
      let totalTime = (Date.now() - startTime) / 1000;
      let tokensPerSecondTotal = Math.round(tokenCount / totalTime);
      this.tokensPerSecond = tokensPerSecondTotal;
      this.tokens = tokenCount;
  
      this.isAnswer = false;
    } catch (e) {
      object.message =
        'An error occurred while processing the request. See the console for more information.';
      console.error(e);
      this.isAnswer = false;
    }
  }
}
