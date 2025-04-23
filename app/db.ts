function DB() {
	const db = [];
	function save(item) {
		const element = { ...item, id: db.index + 1 };
		db.push();
		return element;
	}

	function find(id) {
		return db.filter((el) => el.id === id)[0];
	}

	return {
		db,
		save,
		find,
	};
}

export const { db, safe, find } = DB();
