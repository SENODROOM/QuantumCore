# Quantum Language Compiler - Main Entry Point

## Overview

`src/main.cpp` is the central component of the Quantum Language compiler, responsible for orchestrating the entire compilation process. This includes managing interactions with the lexer, parser, compiler, virtual machine (VM), disassembler, type checker, and error handler. It also handles command-line arguments and directs the execution flow based on user inputs.

### Role in Compiler Pipeline

The `main.cpp` acts as the glue that ties together various parts of the compiler pipeline:

- **Lexer**: Converts source code into tokens.
- **Parser**: Constructs an abstract syntax tree (AST) from tokens.
- **Compiler**: Translates AST into intermediate representation (IR).
- **Virtual Machine (VM)**: Executes IR.
- **Disassembler**: Converts IR back into human-readable assembly code.
- **Type Checker**: Ensures type safety during parsing and compilation.
- **Error Handler**: Manages and reports errors encountered during the compilation process.

### Key Design Decisions and Why

1. **Unified Entry Point**:
   - Replaces both `main.cpp` (v1 tree-walk) and `main_vm.cpp` (early VM draft).
   - Maintains the binary name "quantum," ensuring compatibility with existing scripts, batch files, and CI jobs.

2. **Preservation of Existing Flags**:
   - Keeps all v1 flags intact, allowing users to continue using familiar commands without modifications.
   - Adds new VM-specific flags (`--debug`, `--dis`) for advanced debugging and bytecode inspection.

3. **Command-Line Argument Handling**:
   - Parses command-line arguments to determine the desired operation (run script, REPL, check, test, etc.).
   - Directs the appropriate flow based on the arguments provided.

4. **Global Test Mode Flag**:
   - Introduces a global flag `g_testMode` to prevent blocking calls to `input()` during batch testing.
   - Enhances usability in automated testing environments.

5. **Banner and Achievement Panel**:
   - Displays a banner at startup, providing visual identification of the compiler.
   - Offers an achievement panel to highlight completed milestones, such as the implementation of a complete C++17 compiler and a bytecode VM engine.

### Major Classes/Functions Overview

- **printBanner()**: Outputs the startup banner with the compiler's logo and version information.
- **printAura()**: Provides a visual achievement panel highlighting key milestones.
- **g_testMode**: A boolean flag used to control behavior during batch testing.
- **main()**: The primary function handling command-line arguments and directing the compilation process.

### Tradeoffs

- **Flexibility vs. Simplicity**: By preserving existing flags and adding new ones, the compiler maintains flexibility but may become more complex over time.
- **Performance vs. Debugging**: Adding debug options (`--debug`, `--dis`) can slow down the compilation process but provides valuable insights for developers.
- **User Experience vs. Automation**: The introduction of a global test mode flag improves user experience during interactive sessions while enhancing automation capabilities in batch testing.

This README.md provides a comprehensive overview of the `src/main.cpp` file, detailing its role in the compiler pipeline, key design decisions, major functions, and potential tradeoffs.