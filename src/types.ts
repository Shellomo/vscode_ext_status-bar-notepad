import * as vscode from 'vscode';

export interface NoteState {
    text: string;
    color: string;
    effect: string;
}

export const COLORS = {
    'Default': '',
    'Red': '#ff0000',
    'Green': '#00ff00',
    'Blue': '#0088ff',
    'Yellow': '#ffff00',
    'Orange': '#ffa500',
    'Purple': '#a020f0',
    'Pink': '#ffc0cb',
    'Cyan': '#00ffff'
} as const;

export const EFFECTS = {
    'None': 'none',
    'Blink': 'blink',
    'Rainbow': 'rainbow',
    'Marquee': 'marquee',
    'Pulse': 'pulse',
    'Wave': 'wave'
} as const;

export enum MenuOption {
    AddNote = '$(edit) Add Note',
    ChangeColor = '$(symbol-color) Change Color',
    ChangeEffect = '$(sparkle) Change Effect',
    ClearNote = '$(clear-all) Clear Note'
}