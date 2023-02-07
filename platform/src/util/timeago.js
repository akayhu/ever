const timeAgo = function(dateString, language={'seconds_age':' 秒前', 'minutes_ago': ' 分前', 'hours_ago': ' 小時前', 'days_ago': ' 天前' }) {
    var epoch = 0;
    var dateFormated = "";
    try {
        dateString = dateString.replace(/-/g, "/");
        epoch = Date.parse(dateString);
        dateFormated = new Date(epoch).toISOString().substr(0,10);
        epoch = epoch / 1000;
    } catch(e) {
        return dateString;
    }
    var secs = ((new Date()).getTime() / 1000) - epoch;
    Math.floor(secs);
    var minutes = secs / 60;
    secs = Math.floor(secs % 60);
    if (secs < 0) {
        return '0' + (language.seconds_age);
    }
    if (minutes < 1) {
        return secs + (language.seconds_age);
    }
    var hours = minutes / 60;
    minutes = Math.floor(minutes % 60);
    if (hours < 1) {
        return minutes + (language.minutes_ago);
    }
    var days = hours / 24;
    hours = Math.floor(hours % 24);
    if (days < 1) {
        return hours + (language.hours_ago);
    }

    var weeks = days / 7;
    days = Math.floor(days);
    // days = Math.floor(days % 7);
    if (weeks < 1 && days<2) {
        return days + (language.days_ago);
    } else {
        return dateFormated;
    }
}

export default timeAgo
