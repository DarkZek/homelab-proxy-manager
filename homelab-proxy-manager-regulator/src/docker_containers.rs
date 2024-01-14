use std::process::Command;

#[cfg(debug_assertions)]
pub fn docker_containers() -> String {
    parse_docker_output("\tportfolio_web_1\t1ee0b0ee448b
\tportfolio_gitpull_1\t08074b802795
\tportfolio_gitpull_1\t08074b802795
\trecursing_rocco-main_app-1\tc3d1ca89ee99
\tplex_old\te23fe84f24af
\tseafile\ta96a61d29356
\tseafile-memcached\t938125d60bbf
\tblog_wordpress_1\tefa7343c9c13
\tblog_db_1\tfce516a4163e
\tcloudflare-ddns\t1edee3801bf1".to_string())
}

#[cfg(not(debug_assertions))]
pub fn docker_containers() -> String {
    let output = Command::new("docker").args(["ps", "--format", "{{.Names}}\t{{.ID}}"])
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

    let lines = output.trim().split("\n");

    for line in lines {
        let mut parts = line.split_whitespace();
        
        let container_name = parts.next().unwrap();
        
        let container_id = parts.next().unwrap();
        
        tsv.push_str(format!("{}\t{}\n", container_name, container_id).as_str());
    }
    tsv
}
