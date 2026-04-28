package com.ttn.sporttn;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
public class BackendApplication {

	private final PasswordEncoder passwordEncoder;

	public static void main(String[] args) {SpringApplication.run(BackendApplication.class, args);}

	@Bean
	public CommandLineRunner run() {
		return args -> {
			System.out.println(passwordEncoder.encode("ng26072005"));
		};
	}

}
