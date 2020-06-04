---
title: Sequelize subquery mode
description: Using subquery mode on sequelize
date: '2020-05-04'
draft: false
slug: '/blog/sequelize-subquery-mode'
tags:
  - nodejs
  - sequelize
  - sql
---

## Problem

Recently when I trying to do a more complex select using [Sequelize](https://sequelize.org/master/) I encountered problems because Sequelize try to do a optimization. The select had 5 tables and pagination, as the example below:

```javascript
const filterObject = {
  attributes: ['id', 'name'],
  include: [
    {
      model: ProductLang,
      ...
    },
    {
        model: Category,
        attributes: ['identifier', 'categoryId'],
    },
    {
        model: ProductMarket,
        attributes: [
            [
                sequelize.fn(
                    'COALESCE',
                    sequelize.col('ProductMarkets->ProductSpecialPrice.splprice_price'),
                    sequelize.col('ProductMarkets.selprod_price')
                ),
                'price',
            ],
            [sequelize.col('selprod_price'), 'originalPrice'],
            [
                sequelize.literal(
                    'COALESCE((SELECT COUNT(*) FROM tbl_order_products WHERE op_selprod_id=`ProductMarkets`.`selprod_id`), 0)'
                ),
                'buys',
            ],
            'stock',
            'productMarketId',
        ],
        include: [
            {
                model: ProductSpecialPrices,
                attributes: ['price'],
            },
        ],
        where: {
            userId: marketFilter,
            active: 1,
            deleted: 0,
            stock: {
                [sequelize.Op.gt]: 0,
            },
        },
        order: [
            [
                sequelize.literal(
                    'COALESCE((SELECT COUNT(*) FROM tbl_order_products WHERE op_selprod_id=`ProductMarkets`.`selprod_id`), 0)'
                ),
                'ASC',
            ],
        ],
    },
  ],
  where: {
        active: 1,
        deleted: 0,
    },
    order: [orderByInst],
    offset: offsetValue,
    limit: limitValue,
    raw: true,
};
```

I encountered a problem that sequelize try to optimize the result modifying the select structure, doing some subqueries with the main table that we trying to do the search. So, the result is not as desired.

##SOLUTION

The solution to this problem is using the following parameter in the last line:

```javascript
    ...
    order: [orderByInst],
    offset: offsetValue,
    limit: limitValue,
    raw: true,
    subQuery: false,
};

```

This call will get the select without subqueries. So, in cases that we get more deeper levels of tables and use pagination, the select will not create subqueries, doing the expected result.
