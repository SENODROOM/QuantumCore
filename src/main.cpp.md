# Quantum Language Compiler - Main Entry Point

## Overview

`src/main.cpp` is the primary entry point for the Quantum Language compiler. It orchestrates the entire compilation process by initializing critical components such as the lexer, parser, interpreter, type checker, and error handler. This file also handles command-line arguments and directs the execution flow according to user inputs.

## Key Design Decisions

### Modular Architecture

**WHY:** Implementing a modular architecture allows for easier maintenance and scalability. By breaking down the compiler into distinct modules, each component can be developed, tested, and updated independently without affecting the others. This separation also facilitates unit testing and debugging.

### Command-Line Argument Handling

**WHY:** Providing robust command-line argument handling enables users to control various aspects of the compilation process, such as enabling test mode, specifying input files, and setting output options. This flexibility is crucial for both development and production environments.

### Error Handling and Reporting

**WHY:** Effective error handling and reporting are vital for diagnosing issues in the source code. By integrating a comprehensive error system, the compiler can provide clear and actionable feedback to developers, helping them quickly identify and fix errors.

## Major Classes and Functions

### `printBanner()`
- **Purpose:** Displays the banner and version information for the Quantum Language compiler.
- **Behaviour:** Outputs a colorful ASCII art banner followed by the version and description text.

### `printAura()`
- **Purpose:** Prints an achievement summary indicating the features implemented in the compiler.
- **Behaviour:** Outputs a list of completed features in a visually appealing format using different colors.

### `main(int argc, char* argv[])`
- **Purpose:** The main function serves as the central control point for the compiler.
- **Behaviour:** It parses command-line arguments, initializes the necessary components, and manages the compilation workflow. If running in test mode (`--test`), it bypasses standard input and directly tests the compiler's functionality.

## Tradeoffs and Limitations

- **Complexity:** The modular approach introduces additional complexity in terms of inter-module communication and synchronization.
- **Performance Overhead:** Command-line parsing and initialization add some overhead to the startup time of the compiler.
- **Resource Usage:** The use of dynamic memory allocation for AST nodes and other data structures can lead to increased resource usage, especially for large programs.

## Dependencies

The `src/main.cpp` file depends on several header files located in the `../include` directory, including:

- `Lexer.h`: For lexical analysis and tokenization.
- `Parser.h`: For recursive descent parsing.
- `Interpreter.h`: For executing the compiled code.
- `TypeChecker.h`: For ensuring type safety in the source code.
- `Error.h`: For handling and reporting errors.
- `Value.h`: For representing values and types during interpretation.

These dependencies collectively form the core functionality of the Quantum Language compiler.

## Conclusion

`src/main.cpp` plays a pivotal role in coordinating the various components of the Quantum Language compiler. Its modular design, flexible command-line handling, and comprehensive error reporting make it a robust foundation for developing and maintaining the compiler. While there are certain tradeoffs associated with these choices, they contribute significantly to the overall quality and usability of the Quantum Language.