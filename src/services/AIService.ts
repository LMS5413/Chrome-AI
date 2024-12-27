import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class AIService {

    private session: any;

    async createSession() {
        const session = await (window as any).ai.languageModel.create();
        this.session = session;
        return session;
    }

    async prompt(text: string) {
        const response = await this.session.promptStreaming(text);
        return response;
    }

    checkBrowser() {
        return (window as any).ai 
    }
}