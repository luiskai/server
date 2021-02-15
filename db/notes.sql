SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

drop schema if exists `notes`;

create schema `notes`;
use `notes`;

CREATE TABLE `Usuaris` (
  `Nickname` varchar(255) NOT NULL PRIMARY KEY,
  `Password` varchar(255) NOT NULL,
  `Nom_complet` varchar(255) NOT NULL,
  `Imatge` BLOB
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Alumnes` (
  `Curs_matriculat` varchar(255) NOT NULL,
  `Repetidor` BOOLEAN NOT NULL,
  `Nickname_id` varchar(255) NOT NULL PRIMARY KEY,
  FOREIGN KEY (`Nickname_id`) REFERENCES `Usuaris`(`Nickname`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Professors` (
  `Departament` varchar(255) NOT NULL,
  `Nickname_id` varchar(255) NOT NULL PRIMARY KEY,
  FOREIGN KEY (`Nickname_id`) REFERENCES `Usuaris`(`Nickname`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Assignatures` (
  `id_asignatura` int(11) AUTO_INCREMENT PRIMARY KEY,
  `Codi` varchar(3) NOT NULL,
  `Nom` varchar(255) NOT NULL,
  `Hores_setmanals` int(11) NOT NULL,
  `Cicle` varchar(255) NOT NULL,
  `Curs` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Docencia` (
  `id_alumne` varchar(255) NOT NULL,
  `id_assignatura` int(11)  NOT NULL,
  `id_professor` varchar(255) NOT NULL,
  `Nota` DOUBLE NOT NULL,
  PRIMARY KEY(`id_alumne`,`id_assignatura`),
  FOREIGN KEY (`id_alumne`) REFERENCES `Alumnes`(`Nickname_id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_assignatura`) REFERENCES `Assignatures`(`id_asignatura`) ON DELETE CASCADE,
  FOREIGN KEY (`id_professor`) REFERENCES `Professors`(`Nickname_id`) ON DELETE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Alumnes_Professors` (
	`id_missatge` int(11) AUTO_INCREMENT PRIMARY KEY,
    `Missatge` varchar(255) NOT NULL,
    `Ruta_imatge` varchar(255),
	`Alumnes` varchar(255) NOT NULL,
	`Professors` varchar(255) NOT NULL,
    constraint `fk_Alumnes_Professors_Alumnes` foreign key (`Alumnes`) references `Alumnes`(`Nickname_id`),
    constraint `fk_Alumnes_Professors_Professors` foreign key (`Professors`) references `Professors`(`Nickname_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- INSERTS --

INSERT INTO `Usuaris` (`Nickname`, `Password`, `Nom_complet`,`Imatge`) VALUES
('luis', 'luis', 'Luis Nares Signes', null),
('eugenio', 'eugenio', 'Eugenio Sanz Nogues', null),
('rafael', 'rafael', 'Rafael Alves Mestres', null),
('gonzalo', 'gonzalo', 'Gonzalo Valentin Gallart', null),
('manuel', 'manuel', 'Manuel Heredia Torrecillas', null),
('jesus', 'jesus', 'Jesus Cespedes Cascales', null);

INSERT INTO `Alumnes` (`Curs_matriculat`, `Repetidor`, `Nickname_id`) VALUES
('1dam', true, 'luis'),
('1smx', false, 'eugenio'),
('2asix', false, 'rafael'),
('2dam', true, 'gonzalo');

INSERT INTO `Professors` (`Departament`, `Nickname_id`) VALUES
('Informatica', 'manuel'),
('Literatura Castellana', 'jesus');

INSERT INTO `Assignatures` (`Codi`, `Nom`,`Hores_setmanals`,`Cicle`,`Curs`) VALUES
('PRG', 'Programacio', 8,'dam','segon'),
('BD', 'Bases de dades', 7,'dam','primer'),
('LMI', 'Llenguatge de marques', 4,'smx','segon'),
('SI', 'Sistemes informatics', 6,'dam','primer');

INSERT INTO `Docencia` (`id_alumne`, `id_assignatura`,`id_professor`,`Nota`) VALUES
('luis', 1,'manuel',6.7),
('eugenio', 2,'manuel',8.2),
('rafael', 3,'jesus',4.1),
('gonzalo', 4,'jesus',3.5);
