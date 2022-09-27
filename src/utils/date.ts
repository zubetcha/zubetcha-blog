/**
 * Date 객체를 YYYY-MM-DD 형태로 포매팅
 *
 * @param {Date} date
 * @return {string} YYYY-MM-DD
 */
export const formatDate = (date: string) => {
	const dateObj = new Date(date);
	const year = dateObj.getFullYear();
	const month = get(dateObj.getMonth() + 1);
	const _date = get(dateObj.getDate());

	return `${year}-${month}-${_date}`;
};

const get = (number: number) => {
	return number > 9 ? number : `0${number}`;
};
