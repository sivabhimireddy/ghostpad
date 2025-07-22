import * as vscode from 'vscode';
import * as path from 'path';

export class GhostpadSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'ghostpad.chatWebview';

  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, 'media'))
      ]
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'sendMessage') {
        // For now, just echo the message back
        webviewView.webview.postMessage({ command: 'addMessage', text: `Ghostpad: ${message.text}` });
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <title>Ghostpad Chat</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 0.5em; background: #181818; color: #eee; }
    #chat { height: 300px; overflow-y: auto; border: 1px solid #333; padding: 0.5em; margin-bottom: 0.5em; background: #222; }
    #inputRow { display: flex; }
    #input { flex: 1; padding: 0.5em; border: 1px solid #333; background: #222; color: #eee; }
    #send { padding: 0.5em 1em; background: #444; color: #fff; border: none; cursor: pointer; }
    #send:hover { background: #666; }
  </style>
</head>
<body>
  <div id="chat"></div>
  <div id="inputRow">
    <input id="input" type="text" placeholder="Type a message..." />
    <button id="send">Send</button>
  </div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const chat = document.getElementById('chat');
    const input = document.getElementById('input');
    const send = document.getElementById('send');
    send.onclick = () => {
      const text = input.value;
      if (text) {
        addMessage('You: ' + text);
        vscode.postMessage({ command: 'sendMessage', text });
        input.value = '';
      }
    };
    window.addEventListener('message', event => {
      const message = event.data;
      if (message.command === 'addMessage') {
        addMessage(message.text);
      }
    });
    function addMessage(text) {
      const div = document.createElement('div');
      div.textContent = text;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }
  </script>
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
