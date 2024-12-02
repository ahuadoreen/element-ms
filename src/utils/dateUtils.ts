export default {
  changeTimeToEnd(dateString: string) {
    let date = new Date(dateString);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(998); // 到999毫秒会算到第二天的0点，原因还未知
    return this.formatDate(date);
  },
  formatDate(date: Date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // 月份是从0开始的
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // 补零操作
    let dayStr = day < 10 ? "0" + day : day;
    let monthStr = month < 10 ? "0" + month : month;
    let hoursStr = hours < 10 ? "0" + hours : hours;
    let minutesStr = minutes < 10 ? "0" + minutes : minutes;
    let secondsStr = seconds < 10 ? "0" + seconds : seconds;

    return (
      year +
      "-" +
      monthStr +
      "-" +
      dayStr +
      " " +
      hoursStr +
      ":" +
      minutesStr +
      ":" +
      secondsStr
    );
  },
};
