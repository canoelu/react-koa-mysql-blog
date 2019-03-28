function parseNum(n) {
  return n < 10 ? ('0' + n) : ('' + n);
}

export default function parseDate(value) {
  const dt = new Date(value);
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const date = dt.getDate();
  const hours = parseNum(dt.getHours());
  const mint = parseNum(dt.getMinutes());
  const now = new Date();
  const val = dt.getTime();
  const offset = Math.floor((now.getTime() - val) / (1000 * 60));
  let result;
  let isThisYear;
  let isToday;
  let isYesterday;
  if (now.getFullYear() === year) {
    isThisYear = true;
    if (now.getMonth() === (month - 1)) {
      if (now.getDate() === date) {
        isToday = true;
      } else if (new Date(now.getTime() - 24 * 60 * 60 * 1000).getDate() === date) {
        isYesterday = true;
      }
    }
  }
  if (offset < 60) {
    result = `${offset < 3 ? '刚刚' : offset + '分钟前'}`;
  } else if (isToday) {
    result = `${hours}:${mint}`;
  } else if (isYesterday) {
    result = `昨天 ${hours}:${mint}`;
  } else if (isThisYear) {
    result = `${month}月${date}日 ${hours}:${mint}`;
  } else {
    result = `${year}年 ${month}月${date}日`;
  }
  return result;
  // return dt.getFullYear() + '-' +
  //     (dt.getMonth() + 1) + '-' +
  //     dt.getDate() + ' ' +
  //     dt.getHours() + ':' +
  //     parseNum(dt.getMinutes()) + ':' +
  //     parseNum(dt.getSeconds());
}
