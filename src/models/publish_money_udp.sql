DELIMITER ///
DROP TRIGGER IF EXISTS jsfinance.publish_udp_check;
CREATE TRIGGER jsfinance.publish_udp_check AFTER UPDATE ON money
	FOR EACH ROW
	BEGIN
		DECLARE tmpCMD varchar(255);
		
		set tmpCMD = CONCAT('\\"MODEL\\":\\"MONEY\\"', ',\\"id\\":',NEW.id);

		
		set tmpCMD = CONCAT(tmpCMD, ',\\"categoryId\\":',NEW.categoryId, ', \\"old_categoryId\\":',OLD.categoryId);
		

		IF NEW.description <> OLD.description THEN
			set tmpCMD = CONCAT(tmpCMD, ',\\"description\\":',NEW.description);
		END	IF;

		IF NEW.debit <> OLD.debit THEN
			set tmpCMD = CONCAT(tmpCMD, ',\\"debit\\":',NEW.debit);
		END	IF;

		IF NEW.credit <> OLD.credit THEN
			set tmpCMD = CONCAT(tmpCMD, ',\\"credit\\":',NEW.credit);
		END	IF;

		IF NEW.balance <> OLD.balance THEN
			set tmpCMD = CONCAT(tmpCMD, ',\\"balance\\":',NEW.balance);
		END	IF;


		IF NEW.description != OLD.description OR 
			NEW.debit != OLD.debit OR 
			NEW.credit != OLD.credit OR 
			NEW.balance != OLD.balance OR
			NEW.categoryId != OLD.categoryId THEN 
			set tmpCMD = CONCAT('/opt/jsfinance/src/udp_push.sh "{',tmpCMD,'}"');
	  		set tmpCMD = sys_exec(tmpCMD);
	  	END IF;
	END;
///
DELIMITER ;
