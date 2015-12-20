#To do
- Get access to the sensor id in the promise chain
- Design
- Fix Express deprecated error
- Remove temperatures older than 24 hours (circular buffer?)

The reason why I chose to switch to NoSQL (the database name, not the type; I already used NoSQL (as type)) was because NeDB didn't support two processes reading/writing the same database file. At startup, NeDB loads the database in RAM, ignoring further updates to the raw file. This behaviour resulted into not displaying the latest updates done by the GPIO process.
- https://github.com/louischatriot/nedb/issues/269
- https://github.com/louischatriot/nedb/issues/222
- https://github.com/louischatriot/nedb/issues/105
- https://github.com/louischatriot/nedb/issues/99