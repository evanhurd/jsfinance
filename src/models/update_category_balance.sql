DELIMITER $$
DROP PROCEDURE IF EXISTS update_category_balance;
CREATE PROCEDURE update_category_balance (IN catId INT)
BEGIN

  SET @runningBalance:= 0;
  SET @moneyId:= 0;
  SET @moneyDate:= '1993-02-23 02:35:04';
  -- Get the balance, date and id of first money just before the modified money.
  select
    @moneyDate:=money.createdAt,
    @runningBalance:=money.balance,
    @moneyId:=money.id
  from money
  where money.date < (
    select DATE_SUB(min(money.date), INTERVAL 1 DAY) from money
      left outer join transfers on transfers.moneyId = money.id
        OR transfers.new_moneyId = money.id
      inner join categories on categories.id = money.categoryId
    where money.updatedAt <= transfers.updatedAt
      and categories.id = catId
  )
  and money.categoryId = catId
  order by money.date DESC, money.id ASC limit 0,1;


  -- Update the running balance of each money

  update  money
      set balance = (@runningBalance := @runningBalance + (money.credit - money.debit)),
          updatedAt = NOW()
  where
    (money.createdAt >= @moneyDate or @moneyId = 0)
    and money.categoryId = catId
  order by money.date ASC, money.id ASC;

  SET @balance:= 0;

select @balance:=SUM(credit - debit) from money where categoryId = catId ;

  update categories
  set balance = @balance,
      updatedAt = NOW()
  where id = catId
    and balance <> @balance;
    

END$$
DELIMITER ;
