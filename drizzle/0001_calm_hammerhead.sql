CREATE TABLE `chatSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`clientName` varchar(255),
	`clientEmail` varchar(320),
	`clientPhone` varchar(50),
	`messages` json DEFAULT ('[]'),
	`status` enum('active','closed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`propertyId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(15,2) NOT NULL,
	`area` decimal(10,2) NOT NULL,
	`bedrooms` int DEFAULT 0,
	`bathrooms` int DEFAULT 0,
	`parkingSpots` int DEFAULT 0,
	`type` enum('apartment','house','penthouse','land','commercial') NOT NULL DEFAULT 'apartment',
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`neighborhood` varchar(100),
	`address` text,
	`latitude` float,
	`longitude` float,
	`beachDistance` int,
	`features` json DEFAULT ('[]'),
	`coverImage` text,
	`images` json DEFAULT ('[]'),
	`status` enum('available','sold','rented','reserved') NOT NULL DEFAULT 'available',
	`featured` boolean DEFAULT false,
	`yearBuilt` int,
	`condoFee` decimal(10,2),
	`iptu` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
