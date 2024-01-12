use std::process::Command;

#[cfg(debug_assertions)]
pub fn docker_ip(container_name: &str) -> String {
    "172.22.0.2".to_string()
}

#[cfg(not(debug_assertions))]
pub fn docker_ip(container_name: &str) -> String {
    let output = Command::new("docker").args(["inspect", "-f", "{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}", container_name])
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        format!("Error: {}", String::from_utf8(output.stderr).unwrap())
    } else {
        String::from_utf8(output.stdout).unwrap()
    }
}