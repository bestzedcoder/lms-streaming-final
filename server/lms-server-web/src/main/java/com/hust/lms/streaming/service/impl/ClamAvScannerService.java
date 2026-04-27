package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.service.MalwareScannerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@Slf4j
public class ClamAvScannerService implements MalwareScannerService {

    @Value("${app.clamav.host}")
    private String HOST;
    @Value("${app.clamav.port}")
    private int PORT;

    @Override
    public boolean isSafe(Path file) {
        try (
                Socket socket = new Socket(HOST, PORT);
                OutputStream out = socket.getOutputStream();
                InputStream in = socket.getInputStream()
        ) {

            out.write("zINSTREAM\0".getBytes());
            out.flush();

            try (InputStream fis = Files.newInputStream(file)) {
                byte[] buffer = new byte[8192];
                int read;

                while ((read = fis.read(buffer)) != -1) {
                    out.write(intToBytes(read));
                    out.write(buffer, 0, read);
                }
            }

            out.write(intToBytes(0));
            out.flush();

            String response = new String(in.readAllBytes());

            log.info("ClamAV response: {}", response);

            return response.contains("OK");

        } catch (Exception e) {
            log.error("ClamAV scan error", e);
            return false;
        }
    }

    private byte[] intToBytes(int value) {
        return new byte[] {
                (byte)(value >> 24),
                (byte)(value >> 16),
                (byte)(value >> 8),
                (byte)value
        };
    }
}
