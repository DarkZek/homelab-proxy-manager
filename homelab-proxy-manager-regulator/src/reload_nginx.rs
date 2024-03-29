use std::process::Command;

#[cfg(debug_assertions)]
pub fn reload_nginx() -> String {
    
}

#[cfg(not(debug_assertions))]
pub fn reload_nginx() -> String {
    let output = Command::new("docker").args(["exec", "homelab-proxy-manager-nginx", "nginx", "-s", "reload"])
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        let message = format!("Error: {}", String::from_utf8(output.stderr).unwrap());
        println!("{}", message);
        message
    } else {
        "Success".to_string()
    }
}