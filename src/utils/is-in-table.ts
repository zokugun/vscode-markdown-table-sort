export function isInTable(text: string, startline: number, endline: number): boolean {
	const lines = text.split(/\r\n|\n|\r/);

	if(startline < 0 || lines.length <= startline || lines.length <= endline) {
		return false;
	}

	for(let i = startline; i <= endline; i++) {
		if(!lines[i].trim().startsWith('|')) {
			return false;
		}
	}

	return true;
}
