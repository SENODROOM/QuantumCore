# QuantumLanguage Compiler - Lexer.h

## Overview

The `include/Lexer.h` header file is an essential component of the QuantumLanguage compiler, responsible for converting raw text into tokens. Tokens are the smallest meaningful units of the language, forming the basis for parsing and semantic analysis. This file plays a critical role in the initial phase of the compiler pipeline, where it reads the source code and breaks it down into individual tokens.

## Key Design Decisions

### Use of Token Types

To ensure accurate tokenization, the `Lexer` class utilizes an enumeration (`TokenType`) defined in the `Token.h` header file. This enumeration categorizes different types of tokens such as identifiers, numbers, strings, operators, and keywords. The use of enums helps maintain clarity and consistency throughout the tokenization process.

### Handling F-Strings

F-strings (formatted string literals) are a feature in Python-like languages. To support this feature, the `pendingTokens_` vector is introduced. This vector temporarily holds tokens generated during the expansion of f-strings, allowing them to be combined later when necessary.

### Preprocessor Macros

The `defines_` unordered map is designed to store preprocessor macros. Each macro is associated with a list of replacement tokens. This approach facilitates efficient handling of macros during the preprocessing stage, ensuring that they are expanded correctly before further processing.

## Documentation of Major Classes/Functions

### Lexer Class

**Purpose**: The `Lexer` class is the primary tokenizer in the QuantumLanguage compiler. It takes a source string and converts it into a sequence of tokens.

**Behaviour**:
- Initializes with a source string.
- Provides a method `tokenize()` to convert the source into tokens.
- Handles various lexical elements including numbers, strings, identifiers, operators, and comments.
- Supports f-string expansion through the `pendingTokens_` vector.

### tokenize() Function

**Purpose**: Converts the source code into a vector of tokens.

**Behaviour**:
- Iterates over the source string character by character.
- Calls appropriate helper methods to identify and create tokens.
- Combines tokens from the `pendingTokens_` vector if necessary.
- Returns a vector containing all the tokens.

### Helper Methods

#### current() Method

**Purpose**: Retrieves the current character being processed.

**Behaviour**:
- Returns the character at the current position (`pos`).

#### peek(int offset = 1) Method

**Purpose**: Looks ahead at the next character(s) without advancing the position.

**Behaviour**:
- Returns the character at the current position plus the specified offset.

#### advance() Method

**Purpose**: Advances the position to the next character.

**Behaviour**:
- Increments the position (`pos`) and returns the character at the new position.

#### skipWhitespace() Method

**Purpose**: Skips any whitespace characters in the source.

**Behaviour**:
- Continuously advances the position until a non-whitespace character is encountered.

#### skipComment() Method

**Purpose**: Skips single-line comments starting with `//`.

**Behaviour**:
- Advances the position until the end of the line is reached.

#### skipBlockComment() Method

**Purpose**: Skips multi-line comments enclosed between `/*` and `*/`.

**Behaviour**:
- Advances the position until a closing `*/` is found.

#### readNumber() Method

**Purpose**: Reads and creates a numeric token from the source.

**Behaviour**:
- Continues reading characters while they form a valid number.
- Creates a `NUMBER` token representing the numeric value.

#### readString(char quote) Method

**Purpose**: Reads and creates a string token from the source.

**Behaviour**:
- Continues reading characters until the matching quote is found.
- Creates a `STRING` token representing the string value.

#### readTemplateLiteral(std::vector<Token> &out, int startLine, int startCol) Method

**Purpose**: Reads and processes template literals (f-strings) from the source.

**Behaviour**:
- Recursively expands embedded expressions within the literal.
- Combines resulting tokens into a single `TEMPLATE_LITERAL` token.

#### readIdentifierOrKeyword() Method

**Purpose**: Reads and identifies either an identifier or a keyword.

**Behaviour**:
- Continues reading characters until a non-alphanumeric character is encountered.
- Checks if the identified word is a keyword; if so, creates a corresponding keyword token; otherwise, creates an `IDENTIFIER` token.

#### readOperator() Method

**Purpose**: Reads and identifies operator tokens.

**Behaviour**:
- Continues reading characters until a sequence forms a valid operator.
- Creates an `OPERATOR` token representing the operator.

## Tradeoffs or Limitations

- **Complexity**: Supporting f-string expansion adds complexity to the lexer, requiring additional state management and recursive processing.
- **Performance**: The use of `std::unordered_map` for storing keywords and macros may impact performance, especially for large source files with many macros.
- **Error Handling**: The current implementation focuses on basic tokenization and does not include comprehensive error handling mechanisms. Future enhancements should consider adding robust error reporting capabilities.

This README provides a comprehensive overview of the `Lexer.h` file, detailing its functionality, design decisions, and potential limitations.