import * as vscode from 'vscode';
import { StatusBarManager } from './statusBarManager';
import { NoteState, COLORS, EFFECTS, MenuOption } from './types';

let statusBarManager: StatusBarManager;

export function activate(context: vscode.ExtensionContext) {
    statusBarManager = new StatusBarManager();
    statusBarManager.show();

    // Register show menu command
    let showMenuCommand = vscode.commands.registerCommand('statusbar-notes.showMenu', async () => {
        const selection = await vscode.window.showQuickPick(
            Object.values(MenuOption),
            {
                placeHolder: 'Select an action'
            }
        );

        switch (selection) {
            case MenuOption.AddNote:
                await vscode.commands.executeCommand('statusbar-notes.addNote');
                break;
            case MenuOption.ChangeColor:
                await vscode.commands.executeCommand('statusbar-notes.setColor');
                break;
            case MenuOption.ChangeEffect:
                await vscode.commands.executeCommand('statusbar-notes.setEffect');
                break;
            case MenuOption.ClearNote:
                await vscode.commands.executeCommand('statusbar-notes.clearNote');
                break;
        }
    });

    // Register add note command
    let addNoteCommand = vscode.commands.registerCommand('statusbar-notes.addNote', async () => {
        const note = await vscode.window.showInputBox({
            placeHolder: 'Enter text to show in status bar',
            prompt: 'Add your custom note'
        });

        if (note) {
            const currentState = context.globalState.get<NoteState>('noteState') ||
                {text: '', color: '', effect: 'none'};
            statusBarManager.updateStatusBar(note, currentState.color, currentState.effect);
            context.globalState.update('noteState',
                {text: note, color: currentState.color, effect: currentState.effect});
        }
    });

    // Register set color command
    let setColorCommand = vscode.commands.registerCommand('statusbar-notes.setColor', async () => {
        const colorSelection = await vscode.window.showQuickPick(
            Object.keys(COLORS),
            {
                placeHolder: 'Select a color for your status bar text'
            }
        );

        if (colorSelection) {
            const currentState = context.globalState.get<NoteState>('noteState') ||
                {text: '', color: '', effect: 'none'};
            const color = COLORS[colorSelection as keyof typeof COLORS];
            statusBarManager.updateStatusBar(currentState.text, color, currentState.effect);
            context.globalState.update('noteState',
                {text: currentState.text, color, effect: currentState.effect});
        }
    });

    // Register set effect command
    let setEffectCommand = vscode.commands.registerCommand('statusbar-notes.setEffect', async () => {
        const effectSelection = await vscode.window.showQuickPick(
            Object.keys(EFFECTS),
            {
                placeHolder: 'Select an effect for your status bar text'
            }
        );

        if (effectSelection) {
            const currentState = context.globalState.get<NoteState>('noteState') ||
                {text: '', color: '', effect: 'none'};
            const effect = EFFECTS[effectSelection as keyof typeof EFFECTS];
            statusBarManager.updateStatusBar(currentState.text, currentState.color, effect);
            context.globalState.update('noteState',
                {text: currentState.text, color: currentState.color, effect});
        }
    });

    // Register clear note command
    let clearNoteCommand = vscode.commands.registerCommand('statusbar-notes.clearNote', () => {
        statusBarManager.updateStatusBar('', '', 'none');
        context.globalState.update('noteState', {text: '', color: '', effect: 'none'});
    });

    // Restore previous state if it exists
    const savedState = context.globalState.get<NoteState>('noteState');
    if (savedState?.text) {
        statusBarManager.updateStatusBar(savedState.text, savedState.color, savedState.effect);
    }

    context.subscriptions.push(showMenuCommand);
    context.subscriptions.push(addNoteCommand);
    context.subscriptions.push(clearNoteCommand);
    context.subscriptions.push(setColorCommand);
    context.subscriptions.push(setEffectCommand);
}

export function deactivate() {
    if (statusBarManager) {
        statusBarManager.dispose();
    }
}