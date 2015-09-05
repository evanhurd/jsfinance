DELIMITER $$
DROP PROCEDURE IF EXISTS get_category_monthly_stats;
CREATE PROCEDURE get_category_monthly_stats (IN catId INT)
BEGIN

  -- This statement sums each categoires information together
  select
    SUM(debitCount) as debitCount,
    SUM(creditCount) as creditCount,
    SUM(debits) as debits,
    SUM(credits) as credits,
    SUM(startingBalance) as startingBalance,
    SUM(endingBalance) as endingBalance,
    info.month,
    info.year,
    info.lastday,
    info.firstday
  from (

    -- This statement sums the monies in each category together
  select
    SUM(CASE WHEN debit > 0 THEN 1 ELSE 0 END) as debitCount,
    SUM(CASE WHEN credit > 0 THEN 1 ELSE 0 END) as creditCount,
    sum(debit) as debits,
    sum(credit) as credits,
    info.month, info.year,
    info.lastday,info.firstday,
    (select balance from money where `date` >= info.firstday and `date` <=info.lastday and categoryId = catId order by `date` DESC, `id` ASC  LIMIT 0, 1) startingBalance,
    (select balance from money where `date` >= info.firstday and `date` <=info.lastday and categoryId = catId order by `date` ASC, `id` DESC  LIMIT 0, 1) endingBalance,
    info.categoryid
  FROM (
    -- This statement returns the money
    SELECT
      Month(`date`) as  `month`,
      year(`date`) as `year`,
      debit,
      credit,
      DATE_ADD(LAST_DAY(DATE_SUB(`date`, INTERVAL 1 MONTH)), INTERVAL 1 DAY) AS firstDay,
      LAST_DAY(`date`) as lastDay,
      categoryId
    FROM money
    WHERE date IS NOT NULL
    and categoryId in (

      -- This statement find category and all of it's children
      select DISTINCT categories.id from categories
      join (
        SELECT
        @pv:=child.id AS child
        , parent.id AS parent
        FROM categories parent
        LEFT OUTER JOIN categories child ON child.categoryid = parent.id
        JOIN (SELECT @pv:=catId)tmp
        WHERE parent.id=@pv
      ) tmp2
      where categories.id in (tmp2.child, tmp2.parent)

    )
  ) as info
  group by info.month,info.year,info.lastday,info.firstday, info.categoryid
  order by info.year, info.month

  ) as info
  group by `year`, `month`,
    info.month, info.year,
    info.lastday,info.firstday;

END$$


DELIMITER ;
