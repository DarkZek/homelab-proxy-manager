use std::process::Command;

#[cfg(debug_assertions)]
pub fn curl(url: &str) -> String {
    "HTTP/1.1 401 Unauthorized
    X-Plex-Protocol: 1.0
    Content-Length: 193
    Content-Type: text/html
    Connection: close
    Cache-Control: no-cache
    Date: Tue, 16 Jan 2024 07:52:17 GMT
    
    <html><head><script>window.location = window.location.href.match(/(^.+\\/)[^\\/]*$/)[1] + 'web/index.html';</script><title>Unauthorized</title></head><body><h1>401 Unauthorized</h1></body></html>".to_string()
}

#[cfg(not(debug_assertions))]
pub fn curl(url: &str) -> String {
    let output = Command::new("curl").args(["-i", url])
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        let message = format!("Error: {}", String::from_utf8(output.stderr).unwrap());
        println!("{}", message);
        message
    } else {
        String::from_utf8(output.stdout).unwrap()
    }
}
