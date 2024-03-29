use std::process::Command;

#[cfg(debug_assertions)]
pub fn docker_ports(id: &str) -> String {
    parse_docker_output("  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode
    0: 0B00007F:9D13 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 10651483 1 0000000000000000 100 0 0 10 0
    1: 00000000:0050 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 10651617 1 0000000000000000 100 0 0 10 0")
}

#[cfg(not(debug_assertions))]
pub fn docker_ports(id: &str) -> String {
    let output = Command::new("docker").args(["exec", id, "cat", "/proc/net/tcp"])
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        let message = format!("Error: {}", String::from_utf8(output.stderr).unwrap());
        println!("{}", message);
        message
    } else {
        parse_docker_output(String::from_utf8(output.stdout).unwrap())
    }
}

fn parse_docker_output(output: String) -> String {

    let mut tsv = String::new();

    let lines = output.trim().split("\n").skip(1);

    for line in lines {
        let mut parts = line.split_whitespace();
        
        let container_address = parts.skip(1).next().unwrap();

        let container_port_hex = container_address.split(':').skip(1).next().unwrap();

        let container_port = i32::from_str_radix(container_port_hex, 16).unwrap();
        
        tsv.push_str(format!("{}\n", container_port).as_str());
    }
    tsv
}
