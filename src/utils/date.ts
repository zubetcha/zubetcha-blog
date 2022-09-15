/**
 * Date 객체를 YYYY-MM-DD 형태로 포매팅
 *
 * @param {Date} date
 * @return {string} YYYY-MM-DD
 */
export const formatDate = (date: string) => {
	const dateObj = new Date(date);
	const year = dateObj.getFullYear();
	const month = dateObj.getMonth() + 1;
	const _month = month > 9 ? month : `0${month}`;
	const _date = dateObj.getDate();

	return `${year}-${_month}-${_date}`;
};
