(function() {
    const vscode = acquireVsCodeApi();

    function App() {
        return React.createElement('div', { className: 'space-y-2 text-sm' }, [
            React.createElement('h2', { className: 'font-bold' }, 'Ink Chat'),
            React.createElement('p', null, 'This panel will display chat in a future release.')
        ]);
    }

    ReactDOM.render(React.createElement(App), document.getElementById('root'));
})();
