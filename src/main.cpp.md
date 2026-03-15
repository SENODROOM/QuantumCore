# Quantum Language Compiler - Main Entry Point

## Overview

`src/main.cpp` serves as the primary entry point for the Quantum Language compiler. This file manages the entire compilation process, coordinating interactions between the lexer, parser, interpreter, type checker, and error handler. It also handles command-line arguments and directs the execution flow based on user inputs.

### Role in Compiler Pipeline

The `main.cpp` file acts as the central hub that initiates and controls the stages of the compilation process:
1. **Lexical Analysis**: Converts raw source code into tokens using the `Lexer`.
2. **Parsing**: Constructs an abstract syntax tree (AST) from the tokens using the `Parser`.
3. **Type Checking**: Validates the types within the AST using the `TypeChecker`.
4. **Interpretation**: Executes the program represented by the AST using the `Interpreter`.
5. **Error Handling**: Manages any errors encountered during the above steps using the `ErrorHandler`.

### Key Design Decisions and Why

#### Modular Architecture

The compiler's architecture is designed to be modular, with each component (`Lexer`, `Parser`, `Interpreter`, `TypeChecker`) encapsulating specific functionalities. This separation enhances maintainability and scalability.

#### Command-Line Arguments

Handling command-line arguments allows users to specify options such as input files, output formats, and test modes. This flexibility is crucial for both development and deployment scenarios.

#### Cross-Platform Compatibility

Using standard C++ libraries and conditional compilation directives ensures that the compiler can run on multiple platforms, including Windows, Linux, and macOS.

### Major Classes/Functions Overview

#### `printBanner()`
- **Purpose**: Displays the banner for the Quantum Language compiler.
- **Why**: Provides visual identification and branding for the compiler.

#### `printAura()`
- **Purpose**: Lists achievements and features of the Quantum Language compiler.
- **Why**: Highlights the capabilities and progress made in the project.

#### `g_testMode`
- **Role**: A global flag indicating whether the compiler is running in test mode.
- **Why**: Facilitates automated testing by bypassing interactive input.

### Tradeoffs

#### Complexity vs. Maintainability
- **Complexity**: The modular approach increases complexity due to additional interfaces and dependencies.
- **Maintainability**: Improved maintainability through clear separation of concerns.

#### Performance vs. Flexibility
- **Performance**: Some optimizations might sacrifice flexibility in certain features.
- **Flexibility**: The ability to handle different input sources and configurations comes at the cost of potential performance overhead.

#### Platform Support vs. Standard Compliance
- **Platform Support**: Targeting multiple platforms requires careful handling of platform-specific issues.
- **Standard Compliance**: Adhering strictly to C++ standards might limit platform support.

Overall, `src/main.cpp` plays a pivotal role in orchestrating the Quantum Language compiler's operations, ensuring a robust and flexible system capable of handling diverse programming tasks across different environments.