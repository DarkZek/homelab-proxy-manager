#[cfg(debug_assertions)]
pub fn docker_containers() -> String {
    "\tportfolio_web_1\t1ee0b0ee448b
\tportfolio_gitpull_1\t08074b802795
\tportfolio_gitpull_1\t08074b802795
\trecursing_rocco-main_app-1\tc3d1ca89ee99
\tplex_old\te23fe84f24af
\tseafile\ta96a61d29356
\tseafile-memcached\t938125d60bbf
\tblog_wordpress_1\tefa7343c9c13
\tblog_db_1\tfce516a4163e
\tcloudflare-ddns\t1edee3801bf1".to_string()
}

#[cfg(not(debug_assertions))]
pub fn docker_containers() -> String {
    let output = Command::new("docker ps --format \"{{.Names}}\t{{.ID}}\"")
        .output()
        .expect("Failed to execute command");

    return output;
}