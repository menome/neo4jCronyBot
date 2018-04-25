// name: Test Query
MERGE (m:TestNode {name: "derp"}) SET m.time = apoc.date.currentTimestamp(),m.op=1 RETURN m

// name: Test Query2
MERGE (m:TestNode {name: "derp"}) SET m.op=2 RETURN m