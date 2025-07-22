import * as vscode from 'vscode';
import { GhostpadSidebarProvider } from './webview/ghostpadSidebarProvider';
import { OpenRouterClient, ChatMessage } from './llm/openRouterClient';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new GhostpadSidebarProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('ghostpad.chatWebview', sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ghostpad.explainSelectedCode', explainSelectedCode)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ghostpad.editWithInstruction', editWithInstruction)
  );
}

export function deactivate() {}

async function explainSelectedCode() {
  const key = getOpenRouterKey();
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
  const key = getOpenRouterKey();
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

  editor.edit(builder => builder.replace(selection, edited));
}

function getOpenRouterKey(): string {
  return vscode.workspace.getConfiguration().get<string>('ghostpad.openRouterKey') || '';
}

function getModel(): string {
  return vscode.workspace.getConfiguration().get<string>('ghostpad.model') || 'anthropic/claude-3-sonnet';
}
