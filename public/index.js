//elements
const text = document.querySelector('#answer');

const columns = document.querySelectorAll('.column');

//variables
const symbols = ['+', '-', '%', '(', ')', 'x', '.', '÷'];
let buttons;
let latestText = '25 pomodoro!!!';
let lastIsSymbol = false;
let lastIsEval = false;
let openedBrackets = 0;
let closedBrackets = 0;

//functions
const focusNext = start => {
    text.focus();
    text.setSelectionRange(start + 1, start + 1);
};

const matchThis = () => {
    lastIsEval = true;
    text.value = eval(text.value.replace(/x/g, "*").replace(/÷/g, "/"));
};

//init
(() => {
    text.focus();
    text.setSelectionRange(text.value.length + 1, text.value.length + 1);

    for (let col of columns) buttons = [...buttons ?? [], ...col.querySelectorAll('.button')];

    //запрещаем выбирать множество букв
    text.addEventListener('selectionchange', ev => {
        const el = ev.target;

        const pos = el.selectionStart;
        if (el.selectionStart !== el.selectionEnd) el.selectionStart = el.selectionEnd = pos;

        lastIsSymbol = symbols.includes(el.value[el.selectionStart - 1]) || symbols.includes(el.value[el.selectionStart]);
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (lastIsEval) {
                lastIsEval = false;
                text.value = '';
            };

            openedBrackets = text.value.split('(').length - 1;
            closedBrackets = text.value.split(')').length - 1;

            const selectionStart = text.selectionStart;
            const arr = text.value.split('');

            switch (button.innerHTML) {
                case "C":
                    text.value = '';
                    focusNext(-1);
                    break;
                case "&lt;":
                    arr.splice(selectionStart - 1, 1);
                    text.value = arr.join('');

                    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(text.value[selectionStart - 1])) lastIsSymbol = false;
                    
                    focusNext(selectionStart - 2);
                    break;
                case ".":
                    const arr2 = [...arr];
                    let dothat = true;

                    arr2.splice(selectionStart, 1000);

                    if (lastIsSymbol) break;

                    if (text.value.length < 1) break;

                    for (let symb of arr2.reverse()) {
                        if (symb === '.') {
                            dothat = false;
                            break;
                        };

                        if (['+', '-', '%', '÷', 'x', '(', ')'].includes(symb)) break;
                    };

                    if (dothat) {
                        arr.splice(selectionStart, 0, button.innerHTML);
                        text.value = arr.join('');
                    }
                    break;
                case "+":
                case "-":
                case "x":
                case "÷":
                case "%":
                    if (text.value[text.value.length - 1] === '.' || text.value.length < 1) break;
                    
                    if (lastIsSymbol && text.value[text.value.length - 1] !== ')') break;
                    arr.splice(selectionStart, 0, button.innerHTML);
                    text.value = arr.join('');
                    break;
                case "()":
                    if ((!lastIsSymbol && [')', '.'].includes(text.value[text.value.length - 1])) || [')'].includes(text.value[text.value.length - 1])) break;
                    if (openedBrackets > closedBrackets && lastIsSymbol) break;

                    arr.splice(selectionStart, 0, openedBrackets > closedBrackets ? ')' : '(');
                    text.value = arr.join('');
                    break;
                case "=":
                    matchThis();
                    break;
                default:
                    if (text.value[text.value.length - 1] === ')') break;

                    text.value.length < 1 ?
                        arr.push(button.innerHTML) :
                        arr.splice(selectionStart, 0, button.innerHTML);

                    text.value = arr.join('');

                    focusNext(selectionStart);
            };
        });
    });

    //запрет на убирание выделения чтоб не убирался selectionStart
    document.addEventListener('click', ev => {
        if (ev.target !== text) text.focus();
    });
})();
