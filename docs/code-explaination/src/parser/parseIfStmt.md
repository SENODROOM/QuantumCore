# `parseIfStmt` Function

## Overview

The `parseIfStmt` function is crucial in the Quantum Language compiler's parser component, designed to handle the parsing of `if` statements. This function supports both traditional `if` statements and the more advanced `if-with-initializer` syntax introduced in C++17. The primary role of this function is to construct an Abstract Syntax Tree (AST) node representing the parsed `if` statement, which can then be used for further compilation or analysis phases.

## Parameters

- None explicitly listed in the provided code snippet, but implicitly uses global state such as `current()` and `tokens`.

## Return Value

- Returns an `ASTNodePtr`, which is a unique pointer to an `ASTNode` object representing the parsed `if` statement.

## Detailed Explanation

### Handling Traditional `if` Statements

When encountering a traditional `if` statement, the function checks for the presence of the `else` keyword following the condition. If found, it recursively calls itself to parse the nested `if` statement within the `else` block. Otherwise, it parses the body or statement associated with the `then` clause.

### Handling `if-with-initializer` Syntax

For the `if-with-initializer` syntax, the function first consumes the opening parenthesis (`(`). It then verifies that the next token is the keyword `auto`. Following this, it expects an identifier to represent the variable name being declared. After consuming the identifier, it checks for the assignment operator (`=`) and proceeds to parse the initialization expression using `parseExpr()`. Once the initialization expression is parsed, the function expects a closing parenthesis (`)`).

After handling the initializer part, the function matches the colon (`:`) to indicate the start of the `then` clause. It then skips any newlines and parses either a body or a statement for the `then` clause. If an `else` keyword follows, it again checks for the nested `if` syntax within the `else` block. If no nested `if` is present, it simply parses the `else` body or statement.

Finally, the function constructs an `ASTNode` representing the entire `if` statement, including the optional initializer, condition, and both `then` and `else` branches. This node is then returned as an `ASTNodePtr`.

### Edge Cases

- **Missing Parentheses**: If the parentheses around the condition are missing, the function will throw an error indicating the expected closing parenthesis.
- **Incorrect Assignment Operator**: If the assignment operator (`=`) is replaced with a comparison operator (`==`), the function will fail to recognize the `if-with-initializer` syntax correctly.
- **Misplaced Else Keyword**: If the `else` keyword appears before the `:` indicating the start of the `then` clause, the function will treat it as a separate statement rather than part of the `if` structure.

### Interactions with Other Components

The `parseIfStmt` function interacts closely with several other components within the Quantum Language compiler:

- **Token Stream Management**: It relies on the global `current()` and `tokens` variables to access and manipulate the current token in the input stream.
- **Error Handling**: Utilizes functions like `expect()` and `match()` to ensure correct syntax and throw errors when necessary.
- **Recursive Parsing**: Calls itself to handle nested `if` statements within `else` blocks, demonstrating its recursive nature.
- **AST Construction**: Uses classes like `VarDecl`, `Identifier`, and `IfStmt` to build the AST nodes, showcasing how it integrates with the rest of the compiler's architecture.

This comprehensive approach ensures that the `if` statements are accurately parsed and represented in the AST, facilitating subsequent stages of compilation and execution.