use std::process::Command;
use std::{path::Path, fs, time::Duration};
use std::path::PathBuf;

use local_ports::local_ports;
use docker_ports::docker_ports;
use docker_containers::docker_containers;
use docker_ip::docker_ip;
use reload_nginx::reload_nginx;
use notify::{Watcher, Event, RecursiveMode, Result, EventKind};

mod local_ports;
mod docker_containers;
mod docker_ports;
mod docker_ip;
mod reload_nginx;

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

                let command = path.file_name().unwrap().to_str().unwrap();

                let command_name = command.split('.').next().unwrap();
                let mut command_args = command.split('.').skip(1);

                println!("Running command {}", command);

                match command_name {
                    "local_ports" => {
                        fs::write("./commands/local_ports", local_ports()).unwrap();
                    },
                    "docker_containers" => {
                        fs::write("./commands/docker_containers", docker_containers()).unwrap();
                    },
                    "docker_ports" => {
                        let container_id = command_args.next().unwrap();
                        if let Err(_) = i64::from_str_radix(container_id, 16) {
                            println!("Invalid container id requested {}", container_id);
                            return;
                        }
                        fs::write(format!("./commands/docker_ports.{}", container_id), docker_ports(container_id)).unwrap();
                    },
                    "docker_ip" => {
                        let allowed_characters = "abcdefghijklmnopqrstuvwxyz0123456789-_".chars();
                        let container_name = command_args.next().unwrap();
                        if container_name.chars().any(|c| !allowed_characters.clone().any(|ac| ac == c)) {
                            println!("Invalid container name requested {}", container_name);
                            return;
                        }
                        fs::write(format!("./commands/docker_ip.{}", container_name), docker_ip(&container_name)).unwrap();
                    },
                    "reload_nginx" => {
                        reload_nginx();
                    }
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
