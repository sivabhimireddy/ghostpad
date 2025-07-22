import * as vscode from 'vscode';
import * as path from 'path';

export class InkSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'ink.chatView';

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, 'media'))
      ]
    };

    const scriptUri = webviewView.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'media', 'main.js'))
    );
    const styleUri = webviewView.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'media', 'style.css'))
    );

    webviewView.webview.html = this.getHtml(webviewView.webview, scriptUri, styleUri);
  }

  private getHtml(webview: vscode.Webview, scriptUri: vscode.Uri, styleUri: vscode.Uri): string {
    const nonce = getNonce();
    const tailwind = 'https://cdn.tailwindcss.com';
    const react = 'https://unpkg.com/react@18/umd/react.development.js';
    const reactDom = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}' https:;">
<link href="${styleUri}" rel="stylesheet">
<script nonce="${nonce}" src="${tailwind}"></script>
<script nonce="${nonce}" src="${react}"></script>
<script nonce="${nonce}" src="${reactDom}"></script>
<title>Ink</title>
</head>
<body class="p-2">
<div id="root"></div>
<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
