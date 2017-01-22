CREATE DATABASE IF NOT EXISTS `bikehire` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE IF NOT EXISTS `booking` (
  `emailAddress` varchar(45) NOT NULL,
  `date` date NOT NULL,
  `timeslot` int(1) NOT NULL,
  `bikeNumber` int(1) DEFAULT '1',
  PRIMARY KEY (`emailAddress`,`date`,`timeslot`),
  CONSTRAINT `emailAddress` FOREIGN KEY (`emailAddress`) REFERENCES `employee` (`emailAddress`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `cancellation` (
  `emailAddressCan` varchar(45) NOT NULL,
  `date` date NOT NULL,
  `timeslot` int(1) NOT NULL,
  `bikeNumber` int(1) DEFAULT '1',
  PRIMARY KEY (`emailAddressCan`,`date`,`timeslot`),
  KEY `emailAddress_idx` (`emailAddressCan`),
  CONSTRAINT `emailAddressCan` FOREIGN KEY (`emailAddressCan`) REFERENCES `employee` (`emailAddress`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `employee` (
  `emailAddress` varchar(100) NOT NULL,
  `pin` int(4) DEFAULT NULL,
  `accountVerified` int(1) DEFAULT NULL,
  `hash` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`emailAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `AssignBikeNum`(totalBookings INT, highBikeCount INT, selectedDate date, selectedTimeslot int) RETURNS int(1)
BEGIN
    DECLARE result INT(1);

	IF totalBookings = 0 THEN SET result = 1;
    ELSEIF totalBookings = highBikeCount THEN SET result = highBikeCount+1;
    ELSEIF not exists(SELECT bikeNumber FROM booking WHERE bikeNumber=1 AND date=selectedDate AND timeslot=selectedTimeslot) THEN SET result = 1;
    ELSEIF not exists(SELECT bikeNumber FROM booking WHERE bikeNumber=2 AND date=selectedDate AND timeslot=selectedTimeslot) THEN SET result = 2;
    ELSEIF not exists(SELECT bikeNumber FROM booking WHERE bikeNumber=3 AND date=selectedDate AND timeslot=selectedTimeslot) THEN SET result = 3;
    ELSEIF not exists(SELECT bikeNumber FROM booking WHERE bikeNumber=4 AND date=selectedDate AND timeslot=selectedTimeslot) THEN SET result = 4;
    ELSEIF not exists(SELECT bikeNumber FROM booking WHERE bikeNumber=5 AND date=selectedDate AND timeslot=selectedTimeslot) THEN SET result = 5;

    END IF;
    RETURN result;
  END$$
DELIMITER ;
