import * as vscode from 'vscode';
import { StatusBarManager } from './statusBarManager';
import { NoteState, COLORS, EFFECTS, MenuOption } from './types';

let statusBarManager: StatusBarManager;

async function showMainMenu(context: vscode.ExtensionContext) {
    const selection = await vscode.window.showQuickPick(
        Object.values(MenuOption),
        {
            placeHolder: 'Select an action'
        }
    );

    if (selection) {
        switch (selection) {
            case MenuOption.AddNote:
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
                // Show menu again after adding note
                await showMainMenu(context);
                break;

            case MenuOption.ChangeColor:
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
                // Show menu again after changing color
                await showMainMenu(context);
                break;

            case MenuOption.ChangeEffect:
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
                // Show menu again after changing effect
                await showMainMenu(context);
                break;

            case MenuOption.ClearNote:
                statusBarManager.updateStatusBar('', '', 'none');
                context.globalState.update('noteState', {text: '', color: '', effect: 'none'});
                // Show menu again after clearing note
                await showMainMenu(context);
                break;
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    statusBarManager = new StatusBarManager();
    statusBarManager.show();

    // Register show menu command with the new persistent menu
    let showMenuCommand = vscode.commands.registerCommand('statusbar-notes.showMenu', () => {
        showMainMenu(context);
    });

    // Restore previous state if it exists
    const savedState = context.globalState.get<NoteState>('noteState');
    if (savedState?.text) {
        statusBarManager.updateStatusBar(savedState.text, savedState.color, savedState.effect);
    }

    context.subscriptions.push(showMenuCommand);
    context.subscriptions.push(statusBarManager);
}

export function deactivate() {
    if (statusBarManager) {
        statusBarManager.dispose();
    }
}