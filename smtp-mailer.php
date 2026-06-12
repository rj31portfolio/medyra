<?php

function smtp_send_mail(array $config, string $subject, string $htmlBody, string $plainBody, ?string $replyToEmail = null, ?string $replyToName = null): array
{
    $host = (string) ($config['host'] ?? '');
    $port = (int) ($config['port'] ?? 0);
    $encryption = strtolower((string) ($config['encryption'] ?? 'tls'));
    $username = (string) ($config['username'] ?? '');
    $password = (string) ($config['password'] ?? '');
    $fromEmail = (string) ($config['from_email'] ?? '');
    $fromName = (string) ($config['from_name'] ?? '');
    $toEmail = (string) ($config['to_email'] ?? '');
    $toName = (string) ($config['to_name'] ?? '');
    $timeout = (int) ($config['connect_timeout'] ?? 15);

    if ($host === '' || $port <= 0 || $fromEmail === '' || $toEmail === '' || $username === '' || $password === '') {
        return ['success' => false, 'message' => 'SMTP configuration is incomplete.'];
    }

    $transport = $encryption === 'ssl' ? 'ssl://' . $host : $host;
    $socket = @stream_socket_client(
        $transport . ':' . $port,
        $errorCode,
        $errorMessage,
        $timeout,
        STREAM_CLIENT_CONNECT
    );

    if (!is_resource($socket)) {
        return ['success' => false, 'message' => 'SMTP connection failed: ' . $errorMessage];
    }

    stream_set_timeout($socket, $timeout);

    $hostname = gethostname();
    if ($hostname === false || $hostname === '') {
        $hostname = 'localhost';
    }

    $boundary = 'bnd_' . bin2hex(random_bytes(12));
    $fromHeader = smtp_format_address($fromEmail, $fromName);
    $toHeader = smtp_format_address($toEmail, $toName);
    $replyToHeader = $replyToEmail ? smtp_format_address($replyToEmail, $replyToName ?? '') : $fromHeader;

    $headers = [
        'Date: ' . date(DATE_RFC2822),
        'From: ' . $fromHeader,
        'To: ' . $toHeader,
        'Reply-To: ' . $replyToHeader,
        'Subject: ' . smtp_encode_header($subject),
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];

    $message = implode("\r\n", $headers) . "\r\n\r\n";
    $message .= '--' . $boundary . "\r\n";
    $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $message .= $plainBody . "\r\n\r\n";
    $message .= '--' . $boundary . "\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $message .= $htmlBody . "\r\n\r\n";
    $message .= '--' . $boundary . "--\r\n";

    try {
        smtp_expect($socket, [220]);
        smtp_command($socket, 'EHLO ' . $hostname, [250]);

        if ($encryption === 'tls') {
            smtp_command($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('Unable to start TLS encryption.');
            }
            smtp_command($socket, 'EHLO ' . $hostname, [250]);
        }

        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($username), [334]);
        smtp_command($socket, base64_encode($password), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $fromEmail . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $toEmail . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);
        smtp_command($socket, smtp_escape_data($message) . "\r\n.", [250]);
        smtp_command($socket, 'QUIT', [221]);
    } catch (RuntimeException $exception) {
        fclose($socket);
        return ['success' => false, 'message' => $exception->getMessage()];
    }

    fclose($socket);
    return ['success' => true, 'message' => 'Email sent successfully.'];
}

function smtp_command($socket, string $command, array $expectedCodes): string
{
    fwrite($socket, $command . "\r\n");
    return smtp_expect($socket, $expectedCodes);
}

function smtp_expect($socket, array $expectedCodes): string
{
    $response = '';

    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (preg_match('/^\d{3} /', $line) === 1) {
            break;
        }
    }

    if ($response === '') {
        throw new RuntimeException('SMTP server returned an empty response.');
    }

    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('SMTP error: ' . trim($response));
    }

    return $response;
}

function smtp_escape_data(string $message): string
{
    $normalized = str_replace(["\r\n", "\r"], "\n", $message);
    $normalized = str_replace("\n.", "\n..", $normalized);
    return str_replace("\n", "\r\n", $normalized);
}

function smtp_format_address(string $email, string $name = ''): string
{
    $email = trim($email);
    $name = trim($name);

    if ($name === '') {
        return $email;
    }

    return smtp_encode_header($name) . ' <' . $email . '>';
}

function smtp_encode_header(string $value): string
{
    if ($value === '') {
        return '';
    }

    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}
