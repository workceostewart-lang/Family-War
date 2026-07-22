CREATE TABLE `lobbies` (
	`code` text PRIMARY KEY NOT NULL,
	`host_token` text NOT NULL,
	`guest_token` text,
	`host_family_name` text NOT NULL,
	`guest_family_name` text,
	`family_size` integer NOT NULL,
	`difficulty` text NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`game_state` text,
	`pending_answer` text,
	`pending_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
