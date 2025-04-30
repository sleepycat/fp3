// @ts-nocheck
import { DatabaseSync } from "node:sqlite";
import connect, { sql as dbsql } from "@databases/sqlite";

// TODO: read this filename from the env
const connection = connect("seizures.db");

export async function sql(strings, ...vars) {
	return connection.query(dbsql(strings, ...vars));
}
