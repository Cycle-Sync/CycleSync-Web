use std::fs::{File, OpenOptions};
use std::io::{self, Read, Write};
use std::path::Path;

use chrono::{DateTime, Utc};
use clap::{Parser, Subcommand};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Todo {
    id: String,
    title: String,
    description: Option<String>,
    completed: bool,
    created_at: DateTime<Utc>,
}

impl Todo {
    fn new(title: String, description: Option<String>) -> Self {
        Todo {
            id: Uuid::new_v4().to_string(),
            title,
            description,
            completed: false,
            created_at: Utc::now(),
        }
    }

    fn mark_completed(&mut self) {
        self.completed = true;
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct TodoList {
    todos: Vec<Todo>,
}

impl TodoList {
    fn new() -> Self {
        TodoList { todos: Vec::new() }
    }

    fn add_todo(&mut self, title: String, description: Option<String>) -> &Todo {
        let todo = Todo::new(title, description);
        self.todos.push(todo);
        self.todos.last().unwrap()
    }

    fn list_todos(&self) -> &Vec<Todo> {
        &self.todos
    }

    fn complete_todo(&mut self, id: &str) -> Result<(), String> {
        if let Some(todo) = self.todos.iter_mut().find(|t| t.id == id) {
            todo.mark_completed();
            Ok(())
        } else {
            Err(format!("Todo with id {} not found", id))
        }
    }

    fn delete_todo(&mut self, id: &str) -> Result<(), String> {
        let initial_len = self.todos.len();
        self.todos.retain(|t| t.id != id);
        
        if self.todos.len() < initial_len {
            Ok(())
        } else {
            Err(format!("Todo with id {} not found", id))
        }
    }

    fn save_to_file(&self, path: &Path) -> io::Result<()> {
        let json = serde_json::to_string_pretty(&self)?;
        let mut file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(path)?;
        file.write_all(json.as_bytes())?;
        Ok(())
    }

    fn load_from_file(path: &Path) -> io::Result<Self> {
        if !path.exists() {
            return Ok(TodoList::new());
        }

        let mut file = File::open(path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;
        
        let todo_list: TodoList = serde_json::from_str(&contents)?;
        Ok(todo_list)
    }
}

#[derive(Parser)]
#[command(name = "rusttodo")]
#[command(about = "A simple CLI todo list manager written in Rust")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Add a new todo
    Add {
        /// Title of the todo
        #[arg(short, long)]
        title: String,
        
        /// Description of the todo
        #[arg(short, long)]
        description: Option<String>,
    },
    
    /// List all todos
    List,
    
    /// Mark a todo as completed
    Complete {
        /// ID of the todo to mark as completed
        #[arg(short, long)]
        id: String,
    },
    
    /// Delete a todo
    Delete {
        /// ID of the todo to delete
        #[arg(short, long)]
        id: String,
    },
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();
    
    let data_dir = std::env::current_dir()?.join("data");
    std::fs::create_dir_all(&data_dir)?;
    
    let todo_file = data_dir.join("todos.json");
    let mut todo_list = TodoList::load_from_file(&todo_file)?;
    
    match cli.command {
        Commands::Add { title, description } => {
            let todo = todo_list.add_todo(title, description);
            println!("Added todo with ID: {}", todo.id);
        }
        
        Commands::List => {
            let todos = todo_list.list_todos();
            if todos.is_empty() {
                println!("No todos found");
            } else {
                println!("Todos:");
                for todo in todos {
                    let status = if todo.completed { "✓" } else { " " };
                    println!(
                        "[{}] ID: {}\n    Title: {}\n    Description: {}\n    Created: {}",
                        status,
                        todo.id,
                        todo.title,
                        todo.description.as_deref().unwrap_or("None"),
                        todo.created_at.format("%Y-%m-%d %H:%M:%S")
                    );
                }
            }
        }
        
        Commands::Complete { id } => {
            match todo_list.complete_todo(&id) {
                Ok(()) => println!("Marked todo {} as completed", id),
                Err(e) => println!("Error: {}", e),
            }
        }
        
        Commands::Delete { id } => {
            match todo_list.delete_todo(&id) {
                Ok(()) => println!("Deleted todo {}", id),
                Err(e) => println!("Error: {}", e),
            }
        }
    }
    
    todo_list.save_to_file(&todo_file)?;
    
    Ok(())
}
