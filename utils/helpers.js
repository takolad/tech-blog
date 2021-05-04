module.exports = {
    limitChars: (content) => {
        return content.substr(0, 300);
    },

    longPost: (content) => {
        if (content.length > 300) {
          return true;
        }
        return false;
    },
    format_date: (date) => {
        return `${new Date(date).toLocaleDateString()}`
    },
    log: (object) => {
        console.log(object);
    },
    isOriginalPoster: (blogUserId, sessionUser) => {
        if (!blogUserId || !sessionUser) {
            return false;
        }
        if (blogUserId === sessionUser) {
            return true;
        } else return false;
    }
};