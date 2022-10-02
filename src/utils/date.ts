/**
 * Date 객체를 YYYY-MM-DD 형태로 포매팅
 *
 * @param {Date} date
 * @return {string} YYYY-MM-DD
 */
export const formatDate = (date: string) => {
	const dateObj = new Date(date);
	const year = dateObj.getFullYear();
	const month = formatNumber(dateObj.getMonth() + 1);
	const _date = formatNumber(dateObj.getDate());

	return `${year}-${month}-${_date}`;
};

const formatNumber = (number: number) => {
	return number > 9 ? number : `0${number}`;
};

export const formatDateInKorean = (date: string) => {
	const [year, month, _date] = date.split('-');
	return `${year}년 ${month}월 ${_date}일`;
};
