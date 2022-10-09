export const formatDate = (date: string, format?: string) => {
	const dateObj = new Date(date);
	const year = dateObj.getFullYear();
	const month = formatNumber(dateObj.getMonth() + 1);
	const _date = formatNumber(dateObj.getDate());

	switch (format) {
		case 'YYYY-MM-DD':
			return `${year}-${month}-${_date}`;

		default:
			const [m, d, y] = date.substring(4, 15).split(' ');
			return [m, d + ',', y].join(' ');
	}
};

const formatNumber = (number: number) => {
	return number > 9 ? number : `0${number}`;
};

export const formatDateInKorean = (date: string) => {
	const [year, month, _date] = date.split('-');
	return `${year}년 ${month}월 ${_date}일`;
};
