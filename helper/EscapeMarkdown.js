const EscapeMarkdown = (text) => {
    if (!text) return '';
    // Chuyển đổi sang string nếu không phải string
    const textStr = String(text);
    return textStr
        .replace(/_/g, '\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\[')
        .replace(/\(/g, '\(')
        .replace(/\)/g, '\)')
        .replace(/~/g, '\~')
        .replace(/`/g, '\`')
        .replace(/>/g, '\>')
        .replace(/#/g, '\#')
        .replace(/\+/g, '\+')
        .replace(/-/g, '\-')
        .replace(/=/g, '\=')
        .replace(/\|/g, '\|')
        .replace(/{/g, '\{')
        .replace(/}/g, '\}')
        .replace(/\./g, '\.')
        .replace(/!/g, '\!');
}
module.exports = EscapeMarkdown