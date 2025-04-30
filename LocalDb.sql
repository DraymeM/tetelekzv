DROP DATABASE IF EXISTS 'danielmarkus'
CREATE DATABASE 'danielmarkus'
USE 'danielmarkus'
-- osszegzes table (1:1 with tetel)
CREATE TABLE osszegzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL
);

-- tetel table
CREATE TABLE tetel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  osszegzes_id INT UNIQUE,
  FOREIGN KEY (osszegzes_id) REFERENCES osszegzes(id) ON DELETE SET NULL
);

-- section table (many sections per tetel)
CREATE TABLE section (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tetel_id INT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (tetel_id) REFERENCES tetel(id) ON DELETE CASCADE
);

-- subsection table (many subsections per section)
CREATE TABLE subsection (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (section_id) REFERENCES section(id) ON DELETE CASCADE
);

-- flashcard table (many flashcards per tetel)
CREATE TABLE flashcard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tetel_id INT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  FOREIGN KEY (tetel_id) REFERENCES tetel(id) ON DELETE CASCADE
);
