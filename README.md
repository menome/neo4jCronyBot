# Neo4j Crony Bot

> *Neo4j* - The World's Leading Graph Database

> *Cron* - A time-based job scheduler in Unix-like computer operating systems. 

> *Crony* - A close friend especially of long standing.

This is a bot that schedules cypher queries to run on a given graph database.

Configure it to connect to neo4j and supply it with a list of queries to run at configured intervals.

#### Example JSON Configuration:
```json
{
  "neo4j": {
    "url": "bolt://neo4j",
    "user": "neo4j",
    "pass": "swordfish"
  },
  "tasks": [
    {
      "name": "Title Case Converter",
      "desc": "Makes sure all Name properties on Cards begin with an uppercase letter.",
      "cronTime": "0 * * * *",
      "query": "MATCH (c:Card) WHERE c.Name =~ $nameregex WITH c, left(c.Name, 1) as firstLetter, right(c.Name, length(c.Name)-1) as rest SET c.Name = (toUpper(firstLetter) + rest) RETURN c",
      "queryParams": {
        "nameregex": "^[a-z]+"
      },
      "timeZone": "America/Los_Angeles",
      "disable": false
    }
  ]
}
```

(Of the above, only name, desc, cronTime, and query are required properties.)

With this config, Crony will, once every hour, run a query that corrects the case of Card nodes with irregular case.