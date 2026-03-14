# parse() Function Explanation

## Complete Code

```cpp
ASTNodePtr Parser::parse()
{
    auto block = std::make_unique<ASTNode>(BlockStmt{}, 0);
    auto &stmts = block->as<BlockStmt>().statements;
    skipNewlines();
    while (!atEnd())
    {
        stmts.push_back(parseStatement());
        skipNewlines();
    }
    return block;
}
```

## Line-by-Line Explanation

### Function Signature (Line 42)
- **Line 42**: `ASTNodePtr Parser::parse()` - Main parsing entry point
  - Returns pointer to AST node containing the entire program
  - Creates top-level block for all statements

### Block Creation (Lines 43-45)
- **Line 43**: `{` - Opening brace
- **Line 44**: `auto block = std::make_unique<ASTNode>(BlockStmt{}, 0);` - Create AST node for program block
  - `BlockStmt{}` creates empty block statement structure
  - `0` indicates line number (program start)
  - `std::make_unique` creates smart pointer for memory management
- **Line 45**: `auto &stmts = block->as<BlockStmt>().statements;` - Get reference to statements vector
  - `as<BlockStmt>()` safely casts to BlockStmt type
  - `statements` is the vector that will hold all program statements

### Initial Cleanup (Line 46)
- **Line 46**: `skipNewlines();` - Skip leading whitespace/newlines
  - Ensures parsing starts at first actual statement

### Main Parsing Loop (Lines 47-51)
- **Line 47**: `while (!atEnd())` - Loop until end of token stream
- **Line 48**: `{` - Opening brace for loop body
- **Line 49**: `stmts.push_back(parseStatement());` - Parse each statement and add to block
  - `parseStatement()` handles individual statement types
  - `push_back()` adds parsed statement to program block
- **Line 50**: `skipNewlines();` - Skip whitespace between statements
- **Line 51**: `}` - Closing brace for loop body

### Return Result (Line 52)
- **Line 52**: `return block;` - Return completed AST
  - Returns smart pointer to root of program AST
- **Line 53**: `}` - Closing brace for function

## Summary

The `parse()` function is the main entry point for the parsing process:

### Key Features
- **Program Structure**: Wraps entire program in a BlockStmt
- **Memory Management**: Uses smart pointers for automatic cleanup
- **Whitespace Handling**: Automatically skips formatting tokens
- **Comprehensive Parsing**: Processes all statements until EOF

### Parsing Process
1. **Initialize Block**: Create container for all statements
2. **Skip Whitespace**: Clean up leading formatting
3. **Parse Loop**: Process each statement sequentially
4. **Clean Separation**: Handle whitespace between statements
5. **Return AST**: Provide complete program structure

### AST Structure
- **Root Node**: BlockStmt containing all program statements
- **Statements**: Sequential list of parsed statements
- **Line Numbers**: Preserved for error reporting
- **Type Safety**: Uses variant-based AST nodes

### Error Handling
- **Statement Level**: Individual statement parsing handles errors
- **Position Tracking**: Line numbers maintained throughout
- **Graceful Recovery**: Continues parsing after statement errors

### Design Benefits
- **Simple Interface**: Single function call to parse entire program
- **Clean Output**: Well-structured AST for interpreter/compiler
- **Efficient**: Single pass through token stream
- **Extensible**: Easy to add new statement types

This function transforms the linear token stream into a hierarchical Abstract Syntax Tree ready for interpretation or compilation.
