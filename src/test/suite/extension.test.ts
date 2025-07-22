console.log('extension.test.ts loaded');
import * as assert from 'assert';
import * as vscode from 'vscode';

describe('Sanity', () => {
  it('should run a basic test', () => {
    assert.strictEqual(1 + 1, 2);
  });
});

describe('Ghostpad Extension', () => {
  it('should be present', async () => {
    const ext = vscode.extensions.getExtension('ghostpad');
    assert.ok(ext, 'Extension should be defined');
    await ext?.activate();
    assert.ok(ext.isActive, 'Extension should be active');
  });
}); 