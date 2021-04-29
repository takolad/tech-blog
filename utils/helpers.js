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
};