#[cfg(debug_assertions)]
pub fn docker_ip(container_name: &str) -> String {
    "172.22.0.2".to_string()
}

#[cfg(not(debug_assertions))]
pub fn docker_ip(container_name: &str) -> String {
    let output = Command::new(format!("docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' {}", container_name))
        .output()
        .expect("Failed to execute command");

    return output;
}