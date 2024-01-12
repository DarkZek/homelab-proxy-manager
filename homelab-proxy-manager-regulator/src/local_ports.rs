use std::process::Command;

#[cfg(debug_assertions)]
pub fn local_ports() -> String {
    let output = "LISTEN               0                    4096                                     127.0.0.1:40027                               0.0.0.0:*                users:((\"casaos\",pid=2419679,fd=8))
    LISTEN               0                    4096                                     127.0.0.1:37849                               0.0.0.0:*                users:((\"casaos-gateway\",pid=2419456,fd=11))
    LISTEN               0                    4096                                       0.0.0.0:8095                                0.0.0.0:*                users:((\"docker-proxy\",pid=3206933,fd=4))
    LISTEN               0                    4096                                       0.0.0.0:32469                               0.0.0.0:*                users:((\"docker-proxy\",pid=3946,fd=4))
    LISTEN               0                    4096                                     127.0.0.1:37189                               0.0.0.0:*                users:((\"casaos-local-st\",pid=2419559,fd=8))
    LISTEN               0                    4096                                     127.0.0.1:37195                               0.0.0.0:*                users:((\"casaos-app-mana\",pid=2419618,fd=9))
    LISTEN               0                    4096                                       0.0.0.0:32400                               0.0.0.0:*                users:((\"docker-proxy\",pid=4078,fd=4))
    LISTEN               0                    50                                         0.0.0.0:445                                 0.0.0.0:*                users:((\"smbd\",pid=1770,fd=46))
    LISTEN               0                    511                                        0.0.0.0:443                                 0.0.0.0:*                users:((\"nginx\",pid=2378441,fd=6),(\"nginx\",pid=2378440,fd=6),(\"nginx\",pid=2378439,fd=6),(\"nginx\",pid=2378438,fd=6),(\"nginx\",pid=2378437,fd=6),(\"nginx\",pid=2378436,fd=6),(\"nginx\",pid=2220452,fd=6))
    LISTEN               0                    4096                                       0.0.0.0:86                                  0.0.0.0:*                users:((\"docker-proxy\",pid=4178,fd=4))
    LISTEN               0                    511                                        0.0.0.0:80                                  0.0.0.0:*                users:((\"nginx\",pid=2378441,fd=7),(\"nginx\",pid=2378440,fd=7),(\"nginx\",pid=2378439,fd=7),(\"nginx\",pid=2378438,fd=7),(\"nginx\",pid=2378437,fd=7),(\"nginx\",pid=2378436,fd=7),(\"nginx\",pid=2220452,fd=7))
    LISTEN               0                    128                                        0.0.0.0:22                                  0.0.0.0:*                users:((\"sshd\",pid=2183096,fd=3))
    LISTEN               0                    50                                         0.0.0.0:139                                 0.0.0.0:*                users:((\"smbd\",pid=1770,fd=47))
    LISTEN               0                    4096                                       0.0.0.0:8324                                0.0.0.0:*                users:((\"docker-proxy\",pid=4098,fd=4))
    LISTEN               0                    4096                                       0.0.0.0:9055                                0.0.0.0:*                users:((\"docker-proxy\",pid=4216,fd=4))
    LISTEN               0                    4096                                       0.0.0.0:9091                                0.0.0.0:*                users:((\"docker-proxy\",pid=3834,fd=4))
    LISTEN               0                    4096                                       0.0.0.0:9117                                0.0.0.0:*                users:((\"docker-proxy\",pid=4259,fd=4))
    LISTEN               0                    4096                                     127.0.0.1:35855                               0.0.0.0:*                users:((\"casaos-message-\",pid=2419493,fd=7))
    LISTEN               0                    4096                                       0.0.0.0:1090                                0.0.0.0:*                users:((\"docker-proxy\",pid=3858,fd=4))
    LISTEN               0                    4096                                       0.0.0.0:9989                                0.0.0.0:*                users:((\"docker-proxy\",pid=4551,fd=4))
    LISTEN               0                    4096                                       0.0.0.0:9789                                0.0.0.0:*                users:((\"docker-proxy\",pid=4973,fd=4))
    LISTEN               0                    4096                                       0.0.0.0:9878                                0.0.0.0:*                users:((\"docker-proxy\",pid=4652,fd=4))
    LISTEN               0                    4096                                     127.0.0.1:34473                               0.0.0.0:*                users:((\"casaos-gateway\",pid=2419456,fd=3))
    LISTEN               0                    4096                                       0.0.0.0:51413                               0.0.0.0:*                users:((\"docker-proxy\",pid=3794,fd=4))
    LISTEN               0                    4096                                 127.0.0.53%lo:53                                  0.0.0.0:*                users:((\"systemd-resolve\",pid=1010,fd=14))
    LISTEN               0                    4096                                       0.0.0.0:3005                                0.0.0.0:*                users:((\"docker-proxy\",pid=4137,fd=4))
    LISTEN               0                    128                                      127.0.0.1:631                                 0.0.0.0:*                users:((\"cupsd\",pid=1895616,fd=7))
    LISTEN               0                    4096                                       0.0.0.0:3080                                0.0.0.0:*                users:((\"docker-proxy\",pid=16009,fd=4))
    LISTEN               0                    4096                                     127.0.0.1:41175                               0.0.0.0:*                users:((\"casaos-user-ser\",pid=2419520,fd=7))
    LISTEN               0                    4096                                          [::]:8095                                   [::]:*                users:((\"docker-proxy\",pid=3206941,fd=4))
    LISTEN               0                    4096                                          [::]:32469                                  [::]:*                users:((\"docker-proxy\",pid=3952,fd=4))
    LISTEN               0                    4096                                          [::]:32400                                  [::]:*                users:((\"docker-proxy\",pid=4085,fd=4))
    LISTEN               0                    50                                            [::]:445                                    [::]:*                users:((\"smbd\",pid=1770,fd=44))
    LISTEN               0                    4096                                          [::]:86                                     [::]:*                users:((\"docker-proxy\",pid=4184,fd=4))
    LISTEN               0                    4096                                             *:85                                        *:*                users:((\"casaos-gateway\",pid=2419456,fd=7))
    LISTEN               0                    128                                           [::]:22                                     [::]:*                users:((\"sshd\",pid=2183096,fd=4))
    LISTEN               0                    50                                            [::]:139                                    [::]:*                users:((\"smbd\",pid=1770,fd=45))
    LISTEN               0                    4096                                          [::]:8324                                   [::]:*                users:((\"docker-proxy\",pid=4105,fd=4))
    LISTEN               0                    4096                                          [::]:9055                                   [::]:*                users:((\"docker-proxy\",pid=4223,fd=4))
    LISTEN               0                    4096                                          [::]:9091                                   [::]:*                users:((\"docker-proxy\",pid=3841,fd=4))
    LISTEN               0                    4096                                          [::]:9117                                   [::]:*                users:((\"docker-proxy\",pid=4265,fd=4))
    LISTEN               0                    128                                          [::1]:631                                    [::]:*                users:((\"cupsd\",pid=1895616,fd=6))
    LISTEN               0                    4096                                          [::]:1090                                   [::]:*                users:((\"docker-proxy\",pid=3866,fd=4))
    LISTEN               0                    4096                                          [::]:9989                                   [::]:*                users:((\"docker-proxy\",pid=4560,fd=4))
    LISTEN               0                    4096                                          [::]:9789                                   [::]:*                users:((\"docker-proxy\",pid=4980,fd=4))
    LISTEN               0                    4096                                          [::]:9878                                   [::]:*                users:((\"docker-proxy\",pid=4659,fd=4))
    LISTEN               0                    4096                                          [::]:51413                                  [::]:*                users:((\"docker-proxy\",pid=3801,fd=4))
    LISTEN               0                    2                                            [::1]:3350                                   [::]:*                users:((\"xrdp-sesman\",pid=1415,fd=7))
    LISTEN               0                    4096                                          [::]:3005                                   [::]:*                users:((\"docker-proxy\",pid=4144,fd=4))
    LISTEN               0                    2                                                *:3389                                      *:*                users:((\"xrdp\",pid=1456,fd=11))
    LISTEN               0                    4096                                          [::]:3080                                   [::]:*                users:((\"docker-proxy\",pid=16016,fd=4))".to_string();

    return parse_netstat_output(output);
}

#[cfg(not(debug_assertions))]
pub fn local_ports() -> String {
    let output = Command::new("sudo").args(["ss", "-lntpHO"])
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        format!("Error: {}", String::from_utf8(output.stderr).unwrap())
    } else {
        parse_netstat_output(String::from_utf8(output.stdout).unwrap())
    }
}

fn parse_netstat_output(output: String) -> String {

    let mut tsv = String::new();

    let lines = output.trim().split("\n");

    for line in lines {
        let mut parts = line.split_whitespace();
        let _proto = parts.next().unwrap();
        let _recv_q = parts.next().unwrap();
        let _send_q = parts.next().unwrap();
        
        let local_address = parts.next().unwrap();

        let local_port = local_address.split(":").last().unwrap();

        let _foreign_address = parts.next().unwrap();
        
        let program = parts.next().unwrap();

        let program_parts = program.split('"').skip(1).next().unwrap();
        
        tsv.push_str(format!("{}\t{}\n", program_parts, local_port).as_str());
    }
    tsv
}
