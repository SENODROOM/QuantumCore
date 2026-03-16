# Lexer Component - Quantum Language Compiler

The Lexer component is a fundamental module in the Quantum Language compiler, tasked with converting the source code into a series of tokens. These tokens serve as the building blocks for further parsing and semantic analysis within the compiler. This README offers a comprehensive guide on the Lexer's role, its constituent parts, and the overarching process of tokenization.

## Key Features

- **Tokenization**: The primary function of the Lexer is to break down the source code into meaningful tokens.
- **Character Handling**: It processes individual characters from the input stream, identifying keywords, identifiers, literals, and operators.
- **State Management**: The Lexer maintains a state machine to handle different types of tokens efficiently.
- **Error Handling**: It gracefully handles syntax errors and reports them to the user.

## Components

### current()
Returns the current character being processed without advancing the position.

### peek()
Looks ahead at the next character in the input stream without consuming it.

### advance()
Moves to the next character in the input stream and returns it.

### skipWhitespace()
Skips over any whitespace characters encountered in the input stream.

### skipComment()
Ignores single-line comments starting with `//` until the end of the line.

### skipBlockComment()
Handles multi-line comments enclosed between `/*` and `*/`.

### readNumber()
Reads and constructs a numeric literal token from the input stream.

### readString()
Constructs a string literal token by reading characters until a closing quote is found.

## Overall Flow

1. **Initialization**: The Lexer starts by initializing itself with the input source code.
2. **Character Processing**: It iterates through each character in the input stream using the `advance()` method.
3. **State Transition**: Based on the current character, the Lexer transitions between states to identify token types such as keywords, identifiers, literals, and operators.
4. **Token Construction**: When a complete token is identified, it constructs the corresponding token object using helper methods like `readNumber()` and `readString()`.
5. **Skip Mechanisms**: To ignore unnecessary characters like whitespace and comments, the Lexer uses methods like `skipWhitespace()`, `skipComment()`, and `skipBlockComment()`.
6. **Error Detection**: If a syntax error is encountered, the Lexer detects it and reports it appropriately.
7. **Output**: Finally, the Lexer outputs the list of tokens to the parser for further processing.

By following this structured approach, the Lexer ensures efficient and accurate tokenization, laying the groundwork for successful compilation of the Quantum Language source code.