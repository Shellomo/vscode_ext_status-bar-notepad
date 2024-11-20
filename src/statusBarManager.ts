import * as vscode from 'vscode';
import {NoteState} from './types';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;
    private effectInterval: NodeJS.Timeout | undefined;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.initializeStatusBar();
    }

    private initializeStatusBar() {
        this.statusBarItem.text = '📝';
        this.statusBarItem.tooltip = 'Status Bar Notes';
        this.statusBarItem.command = 'statusbar-notes.showMenu';
        this.statusBarItem.show();
    }

    updateStatusBar(text: string, color: string, effect: string) {
        if (this.effectInterval) {
            clearInterval(this.effectInterval);
        }

        if (!text) {
            this.statusBarItem.text = '📝';
            return;
        }

        switch (effect) {
            case 'blink':
                let visible = true;
                this.effectInterval = setInterval(() => {
                    this.statusBarItem.text = visible ? `📝 ${text}` : '📝';
                    visible = !visible;
                }, 1000);
                break;

            case 'rainbow':
                const colors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0088ff', '#a020f0'];
                let colorIndex = 0;
                this.effectInterval = setInterval(() => {
                    this.statusBarItem.color = colors[colorIndex];
                    colorIndex = (colorIndex + 1) % colors.length;
                }, 500);
                this.statusBarItem.text = `📝 ${text}`;
                break;

            case 'marquee':
                const paddedText = `📝 ${text}     `;
                let position = 0;
                this.effectInterval = setInterval(() => {
                    this.statusBarItem.text = paddedText.slice(position) + paddedText.slice(0, position);
                    position = (position + 1) % paddedText.length;
                }, 200);
                break;

            case 'pulse':
                const baseColor = color || '#ffffff';
                let opacity = 1;
                let decreasing = true;
                this.effectInterval = setInterval(() => {
                    if (decreasing) opacity -= 0.1;
                    else opacity += 0.1;

                    if (opacity <= 0.3) decreasing = false;
                    if (opacity >= 1) decreasing = true;

                    this.statusBarItem.color = this.adjustColorOpacity(baseColor, opacity);
                    this.statusBarItem.text = `📝 ${text}`;
                }, 100);
                break;

            case 'wave':
                const emoji = '📝 ';
                const textChars = text.split('');
                let offset = 0;
                this.effectInterval = setInterval(() => {
                    const wavedText = textChars.map((char, i) => {
                        const lift = Math.sin((i + offset) * 0.5) > 0 ? '\u0332' : '';
                        return char + lift;
                    }).join('');
                    this.statusBarItem.text = `${emoji}${wavedText}`;
                    offset += 1;
                }, 150);
                break;

            default:
                this.statusBarItem.text = `📝 ${text}`;
                this.statusBarItem.color = color || undefined;
                break;
        }

        if (effect === 'none') {
            this.statusBarItem.color = color || undefined;
        }
    }

    private adjustColorOpacity(color: string, opacity: number): string {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    }

    dispose() {
        if (this.effectInterval) {
            clearInterval(this.effectInterval);
        }
        this.statusBarItem.dispose();
    }
}
