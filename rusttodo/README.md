# RustTodo

A simple command-line todo list application written in Rust.

## Features

- Add new todos with title and optional description
- List all todos with their details
- Mark todos as completed
- Delete todos
- Persistent storage using JSON files

## Installation

### Prerequisites

- Rust and Cargo (install from [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install))

### Building from source

1. Clone this repository or download the source code
2. Navigate to the project directory
3. Build the project:

```bash
cargo build --release
```

The executable will be available in `target/release/rusttodo`.

## Usage

### Adding a todo

```bash
# Add a todo with just a title
rusttodo add --title "Buy groceries"

# Add a todo with a title and description
rusttodo add --title "Finish project" --description "Complete the Rust todo list project by Friday"
```

### Listing todos

```bash
rusttodo list
```

### Marking a todo as completed

```bash
rusttodo complete --id <todo-id>
```

Replace `<todo-id>` with the ID of the todo you want to mark as completed.

### Deleting a todo

```bash
rusttodo delete --id <todo-id>
```

Replace `<todo-id>` with the ID of the todo you want to delete.

## Data Storage

Todos are stored in a JSON file located at `./data/todos.json` relative to the directory where the application is run.

## License

This project is open source and available under the MIT License.
