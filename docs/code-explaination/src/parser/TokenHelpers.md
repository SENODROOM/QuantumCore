# Token Helper Functions Explanation

## Complete Code

```cpp
Token &Parser::current() { return tokens[pos]; }

Token &Parser::peek(int offset)
{
    size_t p = pos + offset;
    return p < tokens.size() ? tokens[p] : tokens.back();
}

Token &Parser::consume() { return tokens[pos++]; }

Token &Parser::expect(TokenType t, const std::string &msg)
{
    if (current().type != t)
        throw ParseError(msg + " (got '" + current().value + "')", current().line, current().col);
    return consume();
}

bool Parser::check(TokenType t) const { return tokens[pos].type == t; }

bool Parser::match(TokenType t)
{
    if (check(t))
    {
        consume();
        return true;
    }
    return false;
}

bool Parser::atEnd() const { return tokens[pos].type == TokenType::EOF_TOKEN; }

void Parser::skipNewlines()
{
    while (check(TokenType::NEWLINE))
        consume();
}
```

## Code Explanation

###
-  `Token &Parser::current() { return tokens[pos]; }` - Returns current token
  - Returns reference to token at current position
  - Used frequently throughout parsing operations

###
-  `Token &Parser::peek(int offset)` - Look ahead at future tokens
-  `{` - Opening brace
-  `size_t p = pos + offset;` - Calculate peek position
-  `return p < tokens.size() ? tokens[p] : tokens.back();` - Return token or last token if out of bounds
  - Uses ternary operator for bounds checking
  - Returns last token (EOF) if peek goes beyond end
-  `}` - Closing brace

###
-  `Token &Parser::consume() { return tokens[pos++]; }` - Advance and return current token
  - Returns current token and increments position
  - Used to move through token stream during parsing

###
-  `Token &Parser::expect(TokenType t, const std::string &msg)` - Expect specific token type
-  `{` - Opening brace
-  `if (current().type != t)` - Check if current token matches expected type
-  `throw ParseError(msg + " (got '" + current().value + "')", current().line, current().col);` - Throw error with details
  - Includes expected message, actual token value, line and column
-  `return consume();` - Return and advance if token matches
-  `}` - Closing brace

###
-  `bool Parser::check(TokenType t) const { return tokens[pos].type == t; }` - Check token type without advancing
  - Returns true if current token matches type
  - `const` means doesn't modify parser state

###
-  `bool Parser::match(TokenType t)` - Check and consume if matches
-  `{` - Opening brace
-  `if (check(t))` - Check if token matches
-  `{` - Opening brace for match case
-  `consume();` - Consume the matching token
-  `return true;` - Return success
-  `}` - Closing brace for match case
-  `return false;` - Return failure if no match
-  `}` - Closing brace

###
-  `bool Parser::atEnd() const { return tokens[pos].type == TokenType::EOF_TOKEN; }` - Check if at end of token stream
  - Returns true if current token is EOF marker
  - Used to terminate parsing loops

###
-  `void Parser::skipNewlines()` - Skip newline tokens
-  `{` - Opening brace
-  `while (check(TokenType::NEWLINE))` - Loop while current token is newline
-  `consume();` - Consume each newline
-  `}` - Closing brace

## Summary

These token helper functions provide the foundation for token stream navigation:

### Core Operations
- **current()**: Get current token without advancing
- **peek()**: Look ahead at future tokens with bounds checking
- **consume()**: Move to next token and return current
- **expect()**: Validate token type or throw descriptive error

### Conditional Operations
- **check()**: Test token type without consuming
- **match()**: Test and consume if matches
- **atEnd()**: Check for end of input

### Utility Functions
- **skipNewlines()**: Handle whitespace and formatting

### Key Features
- **Error Handling**: expect() provides detailed error messages
- **Bounds Safety**: peek() handles out-of-bounds gracefully
- **Efficiency**: Simple, inline operations for performance
- **Flexibility**: Both consuming and non-consuming operations

These functions enable robust token stream processing while maintaining clear error reporting and safe navigation through the input.
