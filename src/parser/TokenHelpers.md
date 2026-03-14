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

## Line-by-Line Explanation

### current() Function (Line 8)
- **Line 8**: `Token &Parser::current() { return tokens[pos]; }` - Returns current token
  - Returns reference to token at current position
  - Used frequently throughout parsing operations

### peek() Function (Lines 9-13)
- **Line 9**: `Token &Parser::peek(int offset)` - Look ahead at future tokens
- **Line 10**: `{` - Opening brace
- **Line 11**: `size_t p = pos + offset;` - Calculate peek position
- **Line 12**: `return p < tokens.size() ? tokens[p] : tokens.back();` - Return token or last token if out of bounds
  - Uses ternary operator for bounds checking
  - Returns last token (EOF) if peek goes beyond end
- **Line 13**: `}` - Closing brace

### consume() Function (Line 15)
- **Line 15**: `Token &Parser::consume() { return tokens[pos++]; }` - Advance and return current token
  - Returns current token and increments position
  - Used to move through token stream during parsing

### expect() Function (Lines 17-22)
- **Line 17**: `Token &Parser::expect(TokenType t, const std::string &msg)` - Expect specific token type
- **Line 18**: `{` - Opening brace
- **Line 19**: `if (current().type != t)` - Check if current token matches expected type
- **Line 20**: `throw ParseError(msg + " (got '" + current().value + "')", current().line, current().col);` - Throw error with details
  - Includes expected message, actual token value, line and column
- **Line 21**: `return consume();` - Return and advance if token matches
- **Line 22**: `}` - Closing brace

### check() Function (Line 24)
- **Line 24**: `bool Parser::check(TokenType t) const { return tokens[pos].type == t; }` - Check token type without advancing
  - Returns true if current token matches type
  - `const` means doesn't modify parser state

### match() Function (Lines 25-33)
- **Line 25**: `bool Parser::match(TokenType t)` - Check and consume if matches
- **Line 26**: `{` - Opening brace
- **Line 27**: `if (check(t))` - Check if token matches
- **Line 28**: `{` - Opening brace for match case
- **Line 29**: `consume();` - Consume the matching token
- **Line 30**: `return true;` - Return success
- **Line 31**: `}` - Closing brace for match case
- **Line 32**: `return false;` - Return failure if no match
- **Line 33**: `}` - Closing brace

### atEnd() Function (Line 34)
- **Line 34**: `bool Parser::atEnd() const { return tokens[pos].type == TokenType::EOF_TOKEN; }` - Check if at end of token stream
  - Returns true if current token is EOF marker
  - Used to terminate parsing loops

### skipNewlines() Function (Lines 36-40)
- **Line 36**: `void Parser::skipNewlines()` - Skip newline tokens
- **Line 37**: `{` - Opening brace
- **Line 38**: `while (check(TokenType::NEWLINE))` - Loop while current token is newline
- **Line 39**: `consume();` - Consume each newline
- **Line 40**: `}` - Closing brace

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
