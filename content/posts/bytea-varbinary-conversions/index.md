---
title: SQL Server and Postgres bytea and varbinary conversion
description: bytea and varbinary types and their conversions
date: '2020-06-10'
draft: false
slug: '/blog/bytea-varbinary-conversions'
tags:
  - postgresql
  - sql
  - mssql
---

## PROBLEM

When using legacy databases you can face something like this.
On MS SQL Server i have fields with `varbinary` datatype so, the output is like as follows. This is a var-length binary data, in my case, it will be used to save text information regarding of encoding.

```sql
$ SELECT DEPO FROM SB1010 WHERE B1_COD='123'
                                                                            DEPO
----------------------------------------------------------------------------------------------------------------------------------------------
0x70482D66697820657363616C6120646520302D31342C20677261647561E7E36F20646520312070482C20636169786120632F31303020746972617320646520367838356D6D00

```

Now, when we get access of this data, how to convert and, also, how to convert in different databases, like PostgreSQL?

## SOLUTION

### MS SQL

In MS SQL Server we have the `CONVERT` function, we can use like this:

```sql
$ SELECT CONVERT(VARCHAR(MAX), B1_CRVDEPO) FROM SB1010 WHERE B1_COD='123'
                                 DEPO
---------------------------------------------------------------------
pH-fix escala de 0-14, graduação de 1 pH, caixa c/100 tiras de 6x85mm
```

The `CONVERT` function is used in both situations, to retrieve the information and to save the information.

### PostgreSQL

As the data is replicated on other databases, the same thing need to be done in PostgreSQL, for example, so the same select varies accordingly to database pattern, something like this:

```sql
$ SELECT ENCODE("DEPO", 'escape') FROM "SB1010" WHERE "B1_COD"='123';
                                 DEPO
---------------------------------------------------------------------
pH-fix escala de 0-14, graduação de 1 pH, caixa c/100 tiras de 6x85mm

```

Here we need to use `ENCODE()` and `DECODE()` functions, in this case, we need to use `escape` as second parameter to convert in the same way in PostgreSQL.

In other databases like MySQL and MariaDB we need to use another types (LONGBLOB) as we can see [here](https://stackoverflow.com/questions/33266787/what-does-varbinarymax-mean/33266994#33266994).
