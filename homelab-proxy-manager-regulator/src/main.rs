use std::{path::Path, fs, time::Duration};
use std::path::PathBuf;

use local_ports::local_ports;
use docker_containers::docker_containers;
use notify::{Watcher, Event, RecursiveMode, Result, EventKind};

mod local_ports;
mod docker_containers;

fn main() -> Result<()> {

    fs::create_dir_all(Path::new("./commands")).unwrap();
    
    let mut watcher = notify::recommended_watcher(|res: Result<Event>| {
        match res {
           Ok(event) => {

                if let EventKind::Create(_) = event.kind {
                    
                } else {
                    return;
                }

                let path = PathBuf::from(event.paths.get(0).unwrap());

                let command_name = path.file_name().unwrap().to_str().unwrap();

                println!("Running command {}", command_name);

                match command_name {
                    "local_ports" => {
                        fs::write("./commands/local_ports", local_ports());
                    },
                    "docker_containers" => {
                        fs::write("./commands/docker_containers", docker_containers());
                    },
                    _ => println!("Unknown command {}", command_name),
                }
           },
           Err(e) => println!("watch error: {:?}", e),
        }
    })?;

    // Add a path to be watched. All files and directories at that path and
    // below will be monitored for changes.
    watcher.watch(Path::new("./commands"), RecursiveMode::Recursive)?;

    std::thread::sleep(Duration::from_secs(60*60*24*365*100));

    Ok(())
}
