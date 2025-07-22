import * as vscode from 'vscode';
import { InkSidebarProvider } from './webview/inkSidebarProvider';
import { OpenRouterClient, ChatMessage } from './llm/openRouterClient';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new InkSidebarProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(InkSidebarProvider.viewType, sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ink.explainSelectedCode', explainSelectedCode)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ink.editWithInstruction', editWithInstruction)
  );
}

export function deactivate() {}

async function explainSelectedCode() {
  const key = getKey();
  if (!key) {
    vscode.window.showErrorMessage('Set your OpenRouter API key in settings.');
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const selection = editor.document.getText(editor.selection);
  if (!selection) {
    vscode.window.showInformationMessage('No code selected.');
    return;
  }

  const client = new OpenRouterClient(key, getModel());
  const output = await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Explaining code...'
  }, () => client.chat([{ role: 'user', content: `Explain this code:\n\n${selection}` }]));

  vscode.env.clipboard.writeText(output);
  vscode.window.showInformationMessage('Explanation copied to clipboard.');
}

async function editWithInstruction() {
  const key = getKey();
  if (!key) {
    vscode.window.showErrorMessage('Set your OpenRouter API key in settings.');
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const selection = editor.selection;
  const code = editor.document.getText(selection);
  const instruction = await vscode.window.showInputBox({ prompt: 'Instruction for the LLM' });
  if (!instruction) {
    return;
  }

  const client = new OpenRouterClient(key, getModel());
  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a helpful coding assistant.' },
    { role: 'user', content: `Apply the following instruction to the code and return only the updated code.\nInstruction: ${instruction}\n\nCode:\n${code}` }
  ];

  const edited = await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Editing with instruction...'
  }, () => client.chat(messages));

  editor.edit((builder: vscode.TextEditorEdit) => builder.replace(selection, edited));
}

function getKey(): string {
  return vscode.workspace.getConfiguration().get<string>('ink.openRouterKey') || '';
}

function getModel(): string {
  return vscode.workspace.getConfiguration().get<string>('ink.model') || 'anthropic/claude-3-sonnet';
}
